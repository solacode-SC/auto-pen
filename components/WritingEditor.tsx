import styles from './WritingEditor.module.css';

interface WritingEditorProps {
  children: React.ReactNode;
}

export default function WritingEditor({ children }: WritingEditorProps) {
  return (
    <div className={styles.grid}>
      {children}
    </div>
  );
}
