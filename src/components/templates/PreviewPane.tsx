// src/components/templates/PreviewPane.tsx
interface PreviewPaneProps {
    content: string;
  }
  
  export function PreviewPane({ content }: PreviewPaneProps) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: content }} />
      </div>
    );
  }