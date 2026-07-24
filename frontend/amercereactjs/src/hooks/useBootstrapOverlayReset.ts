import { useCallback, useEffect, useRef } from "react";

type OverlayKind = "modal" | "offcanvas";

/**
 * Registers a Bootstrap modal/offcanvas element and runs `onShow` every time it opens.
 */
export function useBootstrapOverlayReset(
  registerElement: ((el: HTMLElement | null) => void) | undefined,
  onShow: () => void,
  kind: OverlayKind = "modal",
) {
  const onShowRef = useRef(onShow);
  onShowRef.current = onShow;

  const cleanupRef = useRef<(() => void) | null>(null);

  const setRef = useCallback(
    (el: HTMLElement | null) => {
      cleanupRef.current?.();
      cleanupRef.current = null;

      registerElement?.(el);

      if (!el) return;

      const eventName =
        kind === "modal" ? "show.bs.modal" : "show.bs.offcanvas";

      const handleShow = () => onShowRef.current();

      el.addEventListener(eventName, handleShow);
      cleanupRef.current = () =>
        el.removeEventListener(eventName, handleShow);
    },
    [registerElement, kind],
  );

  useEffect(() => () => cleanupRef.current?.(), []);

  return setRef;
}
