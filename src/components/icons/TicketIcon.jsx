// Ticket icon from the Figma icon set, drawn in currentColor so it can be tinted
function TicketIcon({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path
        d="M7.939 0.586a2 2 0 0 1 2.829 0l.73.731c.3.3.268.743.056 1.02a1.5 1.5 0 0 0 2.1 2.1l.112-.07a.75.75 0 0 1 .908.126l.74.74a2 2 0 0 1 0 2.83l-1.818 1.817-1.359-1.359a.5.5 0 0 0-.707.707l1.359 1.359-4.828 4.828a2 2 0 0 1-2.829 0l-.74-.74c-.3-.3-.268-.742-.056-1.02l.07-.097a1.5 1.5 0 0 0-2.17-1.98c-.278.212-.721.244-1.022-.056l-.728-.73a2 2 0 0 1 0-2.829l4.827-4.828 1.35 1.35a.5.5 0 0 0 .707-.707l-1.35-1.35L7.939.586Zm1.298 4.936a.5.5 0 0 0-.707.707l1.233 1.233a.5.5 0 0 0 .707-.707L9.237 5.522Z"
        fill="currentColor"
      />
    </svg>
  )
}

export default TicketIcon
