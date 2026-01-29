import { motion } from 'framer-motion';
import { SelectionRect } from '../../utils/alignmentUtils';

interface SelectionBoxProps {
  box: SelectionRect;
  zoom: number;
}

export function SelectionBox({ box, zoom }: SelectionBoxProps) {
  // Normalize box dimensions (handle negative width/height)
  const normalizedBox = {
    x: box.width >= 0 ? box.x : box.x + box.width,
    y: box.height >= 0 ? box.y : box.y + box.height,
    width: Math.abs(box.width),
    height: Math.abs(box.height),
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute pointer-events-none"
      style={{
        left: normalizedBox.x * zoom,
        top: normalizedBox.y * zoom,
        width: normalizedBox.width * zoom,
        height: normalizedBox.height * zoom,
        backgroundColor: 'rgba(82, 183, 136, 0.1)',
        border: '1px dashed rgba(82, 183, 136, 0.6)',
        borderRadius: 4,
      }}
    />
  );
}
