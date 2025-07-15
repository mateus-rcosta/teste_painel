interface OverlayProps {
  show: boolean;
  onClick?: () => void;
}

export const Overlay = ({ show, onClick }: OverlayProps) => {
  if (!show) return null;

  return (
    <div
      onClick={onClick}
      className="fixed left-0 top-0 z-30 w-screen h-screen bg-black opacity-50 hover:cursor-pointer transition-opacity duration-800"
    />
  );
}