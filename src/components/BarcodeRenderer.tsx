import React, { useEffect, useRef } from 'react';
import JsBarcode from 'jsbarcode';

interface BarcodeRendererProps {
  value: string;
  format?: 'CODE128' | 'CODE39' | 'EAN13' | 'pharmacode';
  width?: number;
  height?: number;
  displayValue?: boolean;
  fontSize?: number;
  className?: string;
}

export const BarcodeRenderer: React.FC<BarcodeRendererProps> = ({
  value,
  format = 'CODE128',
  width = 1.8,
  height = 50,
  displayValue = true,
  fontSize = 12,
  className = ''
}) => {
  const svgRef = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    if (svgRef.current && value) {
      try {
        JsBarcode(svgRef.current, value, {
          format,
          width,
          height,
          displayValue,
          fontSize,
          font: 'JetBrains Mono, monospace',
          margin: 4,
          background: '#ffffff',
          lineColor: '#0f172a'
        });
      } catch (err) {
        console.error('JsBarcode rendering error:', err);
      }
    }
  }, [value, format, width, height, displayValue, fontSize]);

  if (!value) {
    return <div className="text-xs text-slate-400">Barcode tidak valid</div>;
  }

  return (
    <div className={`inline-flex flex-col items-center bg-white p-1 rounded ${className}`}>
      <svg ref={svgRef} className="max-w-full" />
    </div>
  );
};
