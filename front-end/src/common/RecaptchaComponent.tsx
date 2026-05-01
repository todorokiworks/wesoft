import React, { useImperativeHandle, forwardRef } from "react";
import ReCAPTCHA from "react-google-recaptcha";

interface RecaptchaComponentProps {
  onCaptchaChange: (token: string | null) => void;
}

const RecaptchaComponent = forwardRef((props: RecaptchaComponentProps, ref) => {
  const { onCaptchaChange } = props;
  const recaptchaRef = React.useRef<ReCAPTCHA | null>(null);

  useImperativeHandle(ref, () => ({
    reset: () => {
      recaptchaRef.current?.reset();
      onCaptchaChange(null);
    },
  }));

  const handleCaptchaChange = (token: string | null) => {
    onCaptchaChange(token);
  };

  return (
    <div>
      <ReCAPTCHA
        ref={recaptchaRef}
        sitekey="6LcN15UqAAAAAJXL6mNNIXnS8qjmDWtnUkpYuEvA"
        onChange={handleCaptchaChange}
      />
    </div>
  );
});

export default RecaptchaComponent;
