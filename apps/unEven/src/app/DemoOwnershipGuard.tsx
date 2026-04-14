import { useEffect, useRef, useState } from "react";
import styles from "./DemoOwnershipGuard.module.css";

const guardNotice = "OSIT demo preview. Copying, redistribution, or rebranding is prohibited.";

function isEditableElement(target: EventTarget | null) {
  return target instanceof HTMLElement
    && (target.isContentEditable
      || target instanceof HTMLInputElement
      || target instanceof HTMLTextAreaElement
      || target instanceof HTMLSelectElement);
}

export function DemoOwnershipGuard() {
  const [noticeVisible, setNoticeVisible] = useState(false);
  const timeoutRef = useRef<number | null>(null);

  useEffect(() => {
    if (typeof window === "undefined" || typeof document === "undefined") {
      return undefined;
    }

    function showNotice() {
      setNoticeVisible(true);

      if (timeoutRef.current !== null) {
        window.clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = window.setTimeout(() => {
        setNoticeVisible(false);
      }, 2400);
    }

    function handleProtectedEvent(event: Event) {
      if (isEditableElement(event.target)) {
        return;
      }

      event.preventDefault();
      showNotice();
    }

    document.addEventListener("copy", handleProtectedEvent);
    document.addEventListener("cut", handleProtectedEvent);
    document.addEventListener("dragstart", handleProtectedEvent);
    document.addEventListener("contextmenu", handleProtectedEvent);

    return () => {
      document.removeEventListener("copy", handleProtectedEvent);
      document.removeEventListener("cut", handleProtectedEvent);
      document.removeEventListener("dragstart", handleProtectedEvent);
      document.removeEventListener("contextmenu", handleProtectedEvent);

      if (timeoutRef.current !== null) {
        window.clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return (
    <>
      <div aria-hidden="true" className={styles.watermark}>
        <span>OSIT DEMO</span>
        <span>CONFIDENTIAL PREVIEW</span>
        <span>NOT FOR REBRANDING</span>
      </div>

      <div className={styles.badge}>
        <strong>OSIT Product Demo</strong>
        <span>Confidential preview. Branding ownership reserved.</span>
      </div>

      <div
        aria-live="polite"
        className={noticeVisible ? `${styles.notice} ${styles.noticeVisible}` : styles.notice}
        role="status"
      >
        {guardNotice}
      </div>
    </>
  );
}
