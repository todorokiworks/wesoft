import "../css/subpage.less";
import React, { useEffect, useState, useRef } from "react";
import { getDataBaseUrl } from "../config";
import {
  Button,
  Carousel,
  Checkbox,
  Form,
  FormProps,
  Input,
  Modal,
  Space,
} from "antd";
import SkeletonView from "../common/SkeletonView";
import * as BusinessEntity from "../entities/Business";
import PrivacyPolicyContent from "./PrivacyPolicyContent";
import { CheckboxChangeEvent } from "antd/es/checkbox";
import RecaptchaComponent from "../common/RecaptchaComponent";

type FieldType = {
  companyName?: string;
  name?: string;
  mail?: string;
  telephone?: string;
  content?: string;
  captchaToken?: string;
};

const Inquiry: React.FC = () => {
  const [items, setEvents] = useState<BusinessEntity.Business[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isCheckboxChecked, setIsCheckboxChecked] = useState(false);
  const [iscaptchaChecked, setIscaptchaChecked] = useState(false);
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const recaptchaRef = useRef<{ reset: () => void } | null>(null);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCheckboxChange = (e: CheckboxChangeEvent) => {
    setIsCheckboxChecked(e.target.checked);
  };

  const [form] = Form.useForm();

  const handleOk = () => {
    form
      .validateFields()
      .then((values) => {
        values["captchaToken"] = captchaToken;

        fetch("/send-mail", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(values),
        })
          .then((response) => {
            if (!response.ok) {
              throw new Error("Network response was not ok");
            }
            return response.json();
          })
          .then((data) => {
            console.log("Success:", data);
            Modal.success({
              title: "送信成功",
              content: "お問い合わせありがとうございました！",
            });
          })
          .catch((error) => {
            console.error("Error:", error);
            Modal.error({
              title: "送信失敗",
              content:
                "お問い合わせの送信に失敗しました。もう一度お試しください。",
            });
          });
        console.log("current", recaptchaRef.current);
        recaptchaRef.current?.reset();

        setIsModalVisible(false);
      })
      .catch((error) => {
        console.error("Validation Error:", error);
      });
  };

  const handleCancel = () => {
    setIsCheckboxChecked(false);
    setIsModalVisible(false);
  };

  const onFinish: FormProps<FieldType>["onFinish"] = () => {
    showModal();
  };

  const onFinishFailed: FormProps<FieldType>["onFinishFailed"] = (
    errorInfo
  ) => {
    console.log("Failed:", errorInfo);
  };

  const handleCaptchaChange = (token: string | null) => {
    if (token !== null) {
      setIscaptchaChecked(true);
    }
    setCaptchaToken(token);
  };

  useEffect(() => {
    const timestamp = new Date().getTime();
    fetch(`${getDataBaseUrl()}/data/business.json?t=${timestamp}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        setEvents(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setError(error.message);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <SkeletonView />;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="subpage business">
      <Carousel autoplay arrows>
        {items.map((item) => {
          const dynamicContentStyle = {
            height: "200px",
            width: "100vw",
            backgroundSize: "cover",
            backgroundPosition: "center",
            justifyContent: "center",
            padding: "4px",
            backgroundImage: `url(${item.coverUrl})`,
          };
          return (
            item.coverUrl && (
              <>
                <Space style={dynamicContentStyle} align="center">
                  <Space
                    direction="vertical"
                    style={{
                      backgroundColor: "rgba(255, 255, 255, 0.8)",
                      minWidth: "100px",
                      padding: "10px",
                      textAlign: "center",
                      borderRadius: "10px",
                    }}
                  >
                    <h3>{item.title}</h3>
                    <p>{item.subTitle}</p>
                  </Space>
                </Space>
              </>
            )
          );
        })}
      </Carousel>
      <Space
        direction="vertical"
        style={{ width: "100%", marginTop: "40px" }}
        align="center"
        wrap
      >
        <Form
          form={form}
          name="basic"
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 50 }}
          labelAlign="left"
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          className="inquiry-form"
          autoComplete="off"
        >
          <Form.Item<FieldType>
            label="会社名"
            name="companyName"
            rules={[{ required: true, message: "会社名を入力してください。" }]}
          >
            <Input maxLength={100} placeholder="ABC株式会社" />
          </Form.Item>
          <Form.Item<FieldType>
            label="お名前"
            name="name"
            rules={[{ required: true, message: "お名前を入力してください。" }]}
          >
            <Input maxLength={50} placeholder="小野　太郎" />
          </Form.Item>

          <Form.Item<FieldType>
            label="メールアドレス"
            name="mail"
            rules={[
              { required: true, message: "メールアドレスを入力してください。" },
              {
                type: "email",
                message: "正しいメールアドレスを入力してください。",
              },
            ]}
          >
            <Input maxLength={50} placeholder="mail@xxx.co.jp" />
          </Form.Item>
          <Form.Item<FieldType>
            label="電話番号"
            name="telephone"
            rules={[
              {
                required: true,
                message: "電話番号を入力してください。",
              },
              {
                pattern: /^[0-9]{10,15}$/,
                message: "正しい電話番号を入力してください。",
              },
            ]}
          >
            <Input maxLength={20} placeholder="07098761234" />
          </Form.Item>

          <Form.Item<FieldType>
            label="問い合わせ内容"
            name="content"
            rules={[
              { required: true, message: "問い合わせ内容を入力してください。" },
            ]}
          >
            <Input.TextArea maxLength={500} rows={4} />
          </Form.Item>
          <div className="recaptcha">
            <RecaptchaComponent
              ref={recaptchaRef}
              onCaptchaChange={handleCaptchaChange}
            />
          </div>

          <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
            <Button
              type="primary"
              disabled={!iscaptchaChecked}
              htmlType="submit"
            >
              送信する
            </Button>
          </Form.Item>
          <Modal
            title="個人情報の取扱いについて"
            open={isModalVisible}
            onOk={handleOk}
            onCancel={handleCancel}
            className="model-main"
            footer={
              <>
                <div
                  style={{
                    display: "flex",
                    marginBottom: "20px",
                    justifyContent: "center",
                    width: "100%",
                  }}
                >
                  <Checkbox onChange={handleCheckboxChange}>
                    上記「個人情報の取扱い」に同意する
                  </Checkbox>
                </div>

                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    width: "100%",
                  }}
                >
                  <Button
                    key="ok"
                    type="primary"
                    style={{ marginRight: "10px" }}
                    disabled={!isCheckboxChecked}
                    onClick={handleOk}
                  >
                    お問合せ送信
                  </Button>
                  <Button key="cancel" onClick={handleCancel}>
                    同意しない
                  </Button>
                </div>
              </>
            }
          >
            <div style={{ height: "400px", overflowY: "auto" }}>
              <PrivacyPolicyContent />
            </div>
          </Modal>
        </Form>
      </Space>
    </div>
  );
};

export default Inquiry;
