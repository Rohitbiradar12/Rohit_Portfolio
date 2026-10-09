import { useEffect, useRef } from "react";

const dialogs = [];
// Preserve nested-modal state and handle Escape even when a busy control loses focus.
export default function useDialog(ref, open, onClose, restoreRef) {
  const closeRef = useRef(onClose);
  closeRef.current = onClose;
  useEffect(() => {
    const node = ref.current;
    if (!open || !node) return;
    const previous = restoreRef?.current || document.activeElement;
    const overflow = document.body.style.overflow;
    const changed = [];
    let branch = node;
    while (branch.parentElement && branch !== document.body) {
      for (const sibling of branch.parentElement.children) {
        if (sibling !== branch && !sibling.hasAttribute("data-dialog-backdrop")) { changed.push([sibling, sibling.inert]); sibling.inert = true; }
      }
      branch = branch.parentElement;
    }
    dialogs.push(node);
    document.body.style.overflow = "hidden";
    const focusable = () => [...node.querySelectorAll('a[href],button:not([disabled]),textarea:not([disabled]),input:not([disabled]),select:not([disabled]),[tabindex="0"]')].filter(el => !el.hidden && el.getClientRects().length);
    const frame = requestAnimationFrame(() => (focusable()[0] || node).focus());
    const keydown = e => {
      if (dialogs.at(-1) !== node) return;
      if (e.key === "Escape") { e.preventDefault(); e.stopPropagation(); closeRef.current(); }
      if (e.key === "Tab") {
        const items = focusable(), first = items[0], last = items.at(-1);
        if (!first) { e.preventDefault(); node.focus(); }
        else if (e.shiftKey && (document.activeElement === first || !node.contains(document.activeElement))) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && (document.activeElement === last || !node.contains(document.activeElement))) { e.preventDefault(); first.focus(); }
      }
    };
    document.addEventListener("keydown", keydown, true);
    return () => {
      cancelAnimationFrame(frame);
      document.removeEventListener("keydown", keydown, true);
      const index = dialogs.lastIndexOf(node); if (index !== -1) dialogs.splice(index, 1);
      for (const [element, inert] of changed) element.inert = inert;
      document.body.style.overflow = overflow;
      if (previous?.isConnected) previous.focus({ preventScroll: true });
    };
  }, [open, ref, restoreRef]);
}
