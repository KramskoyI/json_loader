import './ProgressBar.css';

type ProgressBarProps = {
  value: number;
  max?: number;
};

export function ProgressBar({ value, max = 100 }: ProgressBarProps) {
  return (
    <progress className="ui-progress" max={max} value={value}>
      {value}%
    </progress>
  );
}
