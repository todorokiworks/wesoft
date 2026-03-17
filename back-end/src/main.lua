package.path = "/usr/share/lua/5.1/?.lua;" .. package.path
package.cpath = "/usr/lib/lua/5.1/?.so;" .. package.cpath

local socket = require("socket")
local smtp = require("socket.smtp")
local ltn12 = require("ltn12")
local mime = require("mime")
local cjson = require("cjson")
local http = require("resty.http")


local recaptcha_api_url = "https://www.google.com/recaptcha/api/siteverify"
local secret_key = "6LcN15UqAAAAAA7OX9FgjNJ1hHtyBL_qVhVmV4XQ"

local function validate_recaptcha(token)
    if not token or token == "" then
        return false, "Missing reCAPTCHA token"
    end

    local httpc = http.new()
    local res, err = httpc:request_uri(recaptcha_api_url, {
        method = "POST",
        body = "secret=" .. secret_key .. "&response=" .. token,
        headers = {
            ["Content-Type"] = "application/x-www-form-urlencoded",
        },
        ssl_verify = false
    })

    if not res then
        return false, "HTTP request failed: " .. (err or "unknown error")
    end

    if res.status ~= 200 then
        return false, "HTTP response status: " .. res.status
    end

    local cjson = require("cjson")
    local response_data = cjson.decode(res.body)

    if response_data.success then
        return true, nil
    else
        return false, response_data["error-codes"]
    end
end

local function send_email(from, to, subject, body)

    local headers = {
        ["From"] = from,
        ["To"] = to,
        ["Subject"] = subject,
        ["Content-Type"] = "text/plain; charset=utf-8",
        ["MIME-Version"] = "1.0",
    }

    local header_str = {}
    for k, v in pairs(headers) do

        table.insert(header_str, tostring(k) .. ": " .. tostring(v))
    end

    header_str = table.concat(header_str, "\r\n")
    
    local message = header_str .. "\r\n\r\n" .. (body or "")

    local response, err = smtp.send{
        from = from,
        rcpt = {to},
        source = ltn12.source.string(message),
--        user = "n.hai@wesoft.co.jp",
	 user = "ws.jj@wesoft.co.jp",
	 password = "soumu@WS20200106",
--        password = "n.hai20200106",
        server = "mail14.onamae.ne.jp",
        port = 587,                    
        create = function()
            return socket.tcp()
        end,
        starttls = true, 
    }



    if not response then
        ngx.log(ngx.ERR, "Failed to send email: " .. (err or "unknown error"))
        return nil, "Failed to send email: " .. (err or "unknown error")
    else
        ngx.log(ngx.ERR, "Email sent successfully. Response: ", response)
        return response, nil
    end
end



local function handle_request()
    ngx.req.read_body() 
    local data
    local ok, err = pcall(function()
        data = cjson.decode(ngx.req.get_body_data()) 
    end)

    ngx.header.content_type = 'application/json; charset=utf-8'
    if not ok then
        ngx.status = ngx.HTTP_BAD_REQUEST
        ngx.say(cjson.encode({ success = false, message = "Invalid JSON: " .. (err or "unknown error") }))
        return
    end

    if not data.captchaToken or data.captchaToken == "" then
        ngx.status = ngx.HTTP_BAD_REQUEST
        ngx.say(cjson.encode({ success = false, message = "captchaToken: required"}))
        return
    end

    local valid, err = validate_recaptcha(data.captchaToken)

    if not valid then
        ngx.status = ngx.HTTP_BAD_REQUEST
        ngx.say(cjson.encode({ success = false, message = err}))
        return
    end

    local from =  "ws.jj@wesoft.co.jp"
    --local from =  "n.hai@wesoft.co.jp"
    --local to = "peigen2011@gmail.com"
    local to = "ws.jj@wesoft.co.jp"
    local subject =  "問い合わせ-" .. data.companyName
    local body = string.format("会社名: %s\nお名前: %s\nメールアドレス: %s\n電話番号: %s\n問い合わせ内容: %s\n", data.companyName, data.name, data.mail, data.telephone, data.content)

    local result, error = send_email(from, to, subject, body)




    if error then
        ngx.status = ngx.HTTP_INTERNAL_SERVER_ERROR
        local response = {
            success = false,
            message = error,
        }
        ngx.say(cjson.encode(response))
        return
    else
        local response = {
            success = true,
            message = "Email sent successfully",
            result = result,
        }
        ngx.say(cjson.encode(response))
        return
    end
end


handle_request()