import "../css/subpage.less";
import React, { useState, useRef } from "react";
import {
  Button,
  Checkbox,
  Form,
  FormProps,
  Input,
  Modal,
  Radio,
  Space,
} from "antd";
import PageMeta from "../common/PageMeta";
import SubpageTitle from "../common/SubpageTitle";
import PrivacyPolicyContent from "./PrivacyPolicyContent";
import RecaptchaComponent from "../common/RecaptchaComponent";
import FaqStickyLink from "../common/FaqStickyLink";
import { PAGE_META } from "../seo/pageMeta";

const INQUIRY_TYPES = [
  { value: "quote", label: "お見積りについて" },
  { value: "consultation", label: "相談" },
  { value: "recruitment", label: "採用について" },
] as const;

type InquiryTypeValue = (typeof INQUIRY_TYPES)[number]["value"];

type FieldType = {
  companyName?: string;
  departmentName?: string;
  name?: string;
  mail?: string;
  telephone?: string;
  inquiryType?: InquiryTypeValue;
  remarks?: string;
  privacyAgree?: boolean;
  captchaToken?: string;
};

function buildMailContent(values: FieldType): string {
  const typeEntry = INQUIRY_TYPES.find((t) => t.value === values.inquiryType);
  const typeLabel = typeEntry?.label ?? String(values.inquiryType ?? "");
  const parts = [`【お問い合わせ内容】${typeLabel}`];
  if (values.remarks?.trim()) {
    parts.push(`【備考・相談詳細】\n${values.remarks.trim()}`);
  }
  return parts.join("\n\n");
}

function RequiredLabel({ children }: { children: React.ReactNode }) {
  return (
    <span className="inquiry-form__label-text">
      <span className="inquiry-form__badge">必須</span>
      {children}
    </span>
  );
}

function OptionalLabel({ children }: { children: React.ReactNode }) {
  return (
    <span className="inquiry-form__label-text">
      <span
        className="inquiry-form__badge inquiry-form__badge--spacer"
        aria-hidden
      >
        必須
      </span>
      {children}
    </span>
  );
}

const Inquiry: React.FC = () => {
  const [privacyModalOpen, setPrivacyModalOpen] = useState(false);
  const [iscaptchaChecked, setIscaptchaChecked] = useState(false);
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const recaptchaRef = useRef<{ reset: () => void } | null>(null);

  const [form] = Form.useForm<FieldType>();

  const sendInquiryRequest = (values: FieldType) => {
    const payload = {
      companyName: values.companyName,
      departmentName: values.departmentName ?? "",
      name: values.name,
      mail: values.mail,
      telephone: values.telephone,
      content: buildMailContent(values),
      inquiryType: values.inquiryType,
      remarks: values.remarks ?? "",
      captchaToken,
    };

    fetch("/send-mail", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
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
        form.resetFields();
        setIscaptchaChecked(false);
        setCaptchaToken(null);
        recaptchaRef.current?.reset();
      })
      .catch((err) => {
        console.error("Error:", err);
        Modal.error({
          title: "送信失敗",
          content:
            "お問い合わせの送信に失敗しました。もう一度お試しください。",
        });
      });
  };

  const onFinish: FormProps<FieldType>["onFinish"] = (values) => {
    sendInquiryRequest(values);
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

  return (
    <div className="subpage subpage--inquiry">
      <PageMeta {...PAGE_META["/inquiry"]} />
      <SubpageTitle titleJa="お問い合わせ" titleEn="contact" as="h1" />
      <FaqStickyLink />
      <section className="subpage-section" aria-label="お問い合わせフォーム">
        <p className="inquiry-intro">
          ご不明な点・質問やご相談、お見積依頼など、皆様のご連絡を心よりお待ちしています。
        </p>
        <Space
          direction="vertical"
          style={{ width: "100%", marginTop: "0" }}
          align="center"
          wrap
          className="inquiry-form-wrap"
        >
          <Form<FieldType>
            form={form}
            name="inquiry"
            layout="horizontal"
            labelCol={{ xs: { span: 24 }, sm: { flex: "260px" } }}
            wrapperCol={{ xs: { span: 24 }, sm: { flex: "1" } }}
            labelAlign="left"
            colon={false}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            className="inquiry-form"
            autoComplete="off"
            initialValues={{ inquiryType: "quote" }}
          >
            <Form.Item<FieldType>
              label={<RequiredLabel>貴社名</RequiredLabel>}
              name="companyName"
              rules={[
                { required: true, message: "貴社名を入力してください。" },
              ]}
            >
              <Input maxLength={100} placeholder="" />
            </Form.Item>

            <Form.Item<FieldType>
              label={<OptionalLabel>部署名</OptionalLabel>}
              name="departmentName"
            >
              <Input maxLength={100} placeholder="" />
            </Form.Item>

            <Form.Item<FieldType>
              label={<RequiredLabel>お名前</RequiredLabel>}
              name="name"
              rules={[
                { required: true, message: "お名前を入力してください。" },
              ]}
            >
              <Input maxLength={50} placeholder="" />
            </Form.Item>

            <Form.Item<FieldType>
              label={<RequiredLabel>メールアドレス</RequiredLabel>}
              name="mail"
              rules={[
                {
                  required: true,
                  message: "メールアドレスを入力してください。",
                },
                {
                  type: "email",
                  message: "正しいメールアドレスを入力してください。",
                },
              ]}
            >
              <Input maxLength={50} placeholder="" />
            </Form.Item>

            <Form.Item<FieldType>
              label={<RequiredLabel>電話番号</RequiredLabel>}
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
              <Input maxLength={20} placeholder="" />
            </Form.Item>

            <Form.Item<FieldType>
              label={<RequiredLabel>お問い合わせ内容</RequiredLabel>}
              name="inquiryType"
              rules={[
                {
                  required: true,
                  message: "お問い合わせ内容を選択してください。",
                },
              ]}
            >
              <Radio.Group className="inquiry-form__radios">
                {INQUIRY_TYPES.map((opt) => (
                  <Radio key={opt.value} value={opt.value}>
                    {opt.label}
                  </Radio>
                ))}
              </Radio.Group>
            </Form.Item>

            <Form.Item<FieldType>
              label={<OptionalLabel>備考・相談詳細</OptionalLabel>}
              name="remarks"
            >
              <Input.TextArea maxLength={500} rows={5} placeholder="" />
            </Form.Item>

            <div className="recaptcha">
              <RecaptchaComponent
                ref={recaptchaRef}
                onCaptchaChange={handleCaptchaChange}
              />
            </div>

            <div className="inquiry-form__privacy-wrap">
              <Form.Item<FieldType>
                name="privacyAgree"
                valuePropName="checked"
                rules={[
                  {
                    validator: async (_, checked) => {
                      if (checked !== true) {
                        return Promise.reject(
                          new Error(
                            "プライバシーポリシーに同意してください。"
                          )
                        );
                      }
                      return Promise.resolve();
                    },
                  },
                ]}
                style={{ marginBottom: 8 }}
              >
                <Checkbox>
                  上記に記載したプライバシーポリシーに同意します。
                </Checkbox>
              </Form.Item>
              <button
                type="button"
                className="inquiry-form__policy-link"
                onClick={() => setPrivacyModalOpen(true)}
              >
                プライバシーポリシー
              </button>
            </div>

            <Form.Item className="inquiry-form__submit-wrap" wrapperCol={{ offset: 0 }}>
              <Button
                type="primary"
                className="inquiry-form__submit"
                disabled={!iscaptchaChecked}
                htmlType="submit"
              >
                送信
              </Button>
            </Form.Item>
          </Form>
        </Space>

        <Modal
          title="プライバシーポリシー"
          open={privacyModalOpen}
          onCancel={() => setPrivacyModalOpen(false)}
          className="model-main"
          footer={
            <Button type="primary" onClick={() => setPrivacyModalOpen(false)}>
              閉じる
            </Button>
          }
        >
          <div style={{ maxHeight: "400px", overflowY: "auto" }}>
            <PrivacyPolicyContent />
          </div>
        </Modal>
      </section>
    </div>
  );
};

export default Inquiry;
