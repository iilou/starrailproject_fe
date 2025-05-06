export default function StyledText({ text }: { text: string }) {
  return <div dangerouslySetInnerHTML={{ __html: text }}></div>;
}
