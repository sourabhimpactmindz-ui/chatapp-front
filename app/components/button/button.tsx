import './button.css'
type ButtonLoaderProps = {
  size?: number;
  color?: string;
};

export default function ButtonLoader({
  size = 20,
  color = "#fff",
}: ButtonLoaderProps) {
  return (
    <span
      className="button-loader"
      style={
        {
          "--loader-size": `${size}px`,
          "--loader-color": color,
        } as React.CSSProperties
      }
    />
  );
}