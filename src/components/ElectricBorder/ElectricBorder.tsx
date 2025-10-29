import React, { useEffect, useId, useLayoutEffect, useRef } from 'react';
import type { CSSProperties, PropsWithChildren } from 'react';
import './ElectricBorder.css';

type ElectricBorderProps = PropsWithChildren<{
  color?: string;
  speed?: number;
  chaos?: number;
  thickness?: number;
  className?: string;
  style?: CSSProperties;
}>;

export const ElectricBorder: React.FC<ElectricBorderProps> = ({
  children,
  color = 'var(--accent-primary)',
  speed = 1,
  chaos = 0.8,
  thickness = 2,
  className,
  style
}: ElectricBorderProps) => {
  const rawId = useId().replace(/[:]/g, '');
  const filterId = `turbulent-displace-${rawId}`;
  const svgRef = useRef<SVGSVGElement | null>(null);
  const rootRef = useRef<HTMLDivElement | null>(null);
  const strokeRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const svg = svgRef.current;
    const host = rootRef.current;
    if (!svg || !host) return;

    if (strokeRef.current) {
      strokeRef.current.style.filter = `url(#${filterId})`;
    }

    const width = Math.max(1, Math.round(host.clientWidth || host.getBoundingClientRect().width || 0));
    const height = Math.max(1, Math.round(host.clientHeight || host.getBoundingClientRect().height || 0));

    const dyAnims = Array.from(svg.querySelectorAll<SVGAnimateElement>('feOffset > animate[attributeName="dy"]'));
    if (dyAnims.length >= 2) {
      dyAnims[0].setAttribute('values', `${height}; 0`);
      dyAnims[1].setAttribute('values', `0; -${height}`);
    }

    const dxAnims = Array.from(svg.querySelectorAll<SVGAnimateElement>('feOffset > animate[attributeName="dx"]'));
    if (dxAnims.length >= 2) {
      dxAnims[0].setAttribute('values', `${width}; 0`);
      dxAnims[1].setAttribute('values', `0; -${width}`);
    }

    const baseDur = 6;
    const dur = Math.max(0.001, baseDur / (speed || 1));
    [...dyAnims, ...dxAnims].forEach(a => a.setAttribute('dur', `${dur}s`));

    const disp = svg.querySelector('feDisplacementMap');
    if (disp) disp.setAttribute('scale', String(25 * (chaos || 1)));

    const filterEl = svg.querySelector<SVGFilterElement>(`#${CSS.escape(filterId)}`);
    if (filterEl) {
      filterEl.setAttribute('x', '-200%');
      filterEl.setAttribute('y', '-200%');
      filterEl.setAttribute('width', '500%');
      filterEl.setAttribute('height', '500%');
    }

    requestAnimationFrame(() => {
      [...dyAnims, ...dxAnims].forEach((a: SVGAnimateElement) => {
        if (typeof a.beginElement === 'function') {
          try {
            a.beginElement();
          } catch {
            // Ignore errors
          }
        }
      });
    });
  }, [speed, chaos, filterId]);

  useLayoutEffect(() => {
    if (!rootRef.current) return;
    const ro = new ResizeObserver(() => {
      const svg = svgRef.current;
      const host = rootRef.current;
      if (!svg || !host) return;
      
      const width = Math.max(1, Math.round(host.clientWidth || host.getBoundingClientRect().width || 0));
      const height = Math.max(1, Math.round(host.clientHeight || host.getBoundingClientRect().height || 0));
      
      const dyAnims = Array.from(svg.querySelectorAll<SVGAnimateElement>('feOffset > animate[attributeName="dy"]'));
      if (dyAnims.length >= 2) {
        dyAnims[0].setAttribute('values', `${height}; 0`);
        dyAnims[1].setAttribute('values', `0; -${height}`);
      }

      const dxAnims = Array.from(svg.querySelectorAll<SVGAnimateElement>('feOffset > animate[attributeName="dx"]'));
      if (dxAnims.length >= 2) {
        dxAnims[0].setAttribute('values', `${width}; 0`);
        dxAnims[1].setAttribute('values', `0; -${width}`);
      }
    });
    ro.observe(rootRef.current);
    return () => ro.disconnect();
  }, []);

  const vars: CSSProperties = {
    ['--electric-border-color' as string]: color,
    ['--eb-border-width' as string]: `${thickness}px`
  };

  return (
    <div ref={rootRef} className={`electric-border ${className ?? ''}`} style={{ ...vars, ...style }}>
      <svg ref={svgRef} className="eb-svg" aria-hidden={true}>
        <defs>
          <filter id={filterId} colorInterpolationFilters="sRGB" x="-20%" y="-20%" width="140%" height="140%">
            <feTurbulence type="fractalNoise" baseFrequency="0.05" numOctaves="3" result="noise" seed="0" />
            <feOffset dy="0" result="offset-y">
              <animate attributeName="dy" values="0; 0" dur="6s" repeatCount="indefinite" />
              <animate attributeName="dy" values="0; 0" dur="6s" repeatCount="indefinite" />
            </feOffset>
            <feOffset dx="0" in="offset-y" result="offset-xy">
              <animate attributeName="dx" values="0; 0" dur="6s" repeatCount="indefinite" />
              <animate attributeName="dx" values="0; 0" dur="6s" repeatCount="indefinite" />
            </feOffset>
            <feDisplacementMap in="SourceGraphic" in2="offset-xy" scale="25" xChannelSelector="R" yChannelSelector="G" />
          </filter>
        </defs>
      </svg>
      
      <div className="eb-content">{children}</div>
      
      <div className="eb-layers">
        <div ref={strokeRef} className="eb-stroke" />
        <div className="eb-glow-1" />
        <div className="eb-glow-2" />
        <div className="eb-background-glow" />
      </div>
    </div>
  );
};
