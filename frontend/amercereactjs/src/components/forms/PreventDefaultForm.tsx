import { forwardRef } from "react";

export type PreventDefaultFormProps = React.ComponentPropsWithoutRef<"form">;

/**
 * Client form wrapper: always calls `preventDefault` on submit, then optional `onSubmit`.
 */
export const PreventDefaultForm = forwardRef<HTMLFormElement, PreventDefaultFormProps>(
  function PreventDefaultForm({ onSubmit, ...rest }, ref) {
    return (
      <form
        ref={ref}
        {...rest}
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit?.(e);
        }}
      />
    );
  },
);
