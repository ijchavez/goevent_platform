"use client"

import React, { useEffect, useState } from 'react';
import { generateQRCode } from '@/lib/utils'
import Image from 'next/image';

interface QRCodeComponentProps {
    eventId: string;
  }
const QRCodeComponent = ({ eventId }: { eventId: string }) => {
    const [qrCodeURL, setQRCodeURL] = useState('');

    useEffect(() => {
      const generateAndSetQRCode = async () => {
        const url = await generateQRCode(eventId);
        setQRCodeURL(url);
      };
  
      generateAndSetQRCode();
    }, [eventId]);
  
    return (
      <div>
        {qrCodeURL && <Image src={qrCodeURL} alt="QR Code" width={100} height={100} />}
      </div>
    );
  };
  
  export default QRCodeComponent;
