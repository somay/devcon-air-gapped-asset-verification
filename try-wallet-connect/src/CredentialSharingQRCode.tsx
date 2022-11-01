import React from "react";

import { QRCodeSVG } from "qrcode.react";

interface Props {
  text: string;
}

const CredentialSharingQRCode: React.FC<Props> = ({ text }) => {
  return (
    <div>
      <h2>
        Scan the QR code below with your DID wallet to receive credentials
      </h2>
      <p>Scan with the default camera app. then you'll be redirected to the wallet.</p>
      <QRCodeSVG value={text} size={256} />
      <br />
      <br />
      <code>{text}</code>
    </div>
  );
};

export default CredentialSharingQRCode;
