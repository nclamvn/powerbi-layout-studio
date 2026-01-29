export interface ShortcutGroup {
  title: string;
  shortcuts: {
    keys: string[];
    description: string;
  }[];
}

export const KEYBOARD_SHORTCUTS: ShortcutGroup[] = [
  {
    title: 'General',
    shortcuts: [
      { keys: ['Ctrl', 'S'], description: 'Save project' },
      { keys: ['?'], description: 'Show shortcuts' },
    ],
  },
  {
    title: 'Edit',
    shortcuts: [
      { keys: ['Ctrl', 'Z'], description: 'Undo' },
      { keys: ['Ctrl', 'Y'], description: 'Redo' },
      { keys: ['Ctrl', 'C'], description: 'Copy' },
      { keys: ['Ctrl', 'V'], description: 'Paste' },
      { keys: ['Ctrl', 'D'], description: 'Duplicate' },
      { keys: ['Delete'], description: 'Delete selected' },
    ],
  },
  {
    title: 'Selection',
    shortcuts: [
      { keys: ['Ctrl', 'A'], description: 'Select all' },
      { keys: ['Esc'], description: 'Deselect all' },
      { keys: ['Shift', 'Click'], description: 'Add to selection' },
    ],
  },
  {
    title: 'Canvas',
    shortcuts: [
      { keys: ['Ctrl', '0'], description: 'Zoom to 100%' },
      { keys: ['Ctrl', '+'], description: 'Zoom in' },
      { keys: ['Ctrl', '-'], description: 'Zoom out' },
    ],
  },
  {
    title: 'Move Visuals',
    shortcuts: [
      { keys: ['Arrow Keys'], description: 'Move 1px' },
      { keys: ['Shift', 'Arrow Keys'], description: 'Move 10px' },
    ],
  },
];

export const SHORTCUT_MAP = {
  // Undo/Redo
  'ctrl+z': 'undo',
  'meta+z': 'undo',
  'ctrl+y': 'redo',
  'meta+y': 'redo',
  'ctrl+shift+z': 'redo',
  'meta+shift+z': 'redo',

  // Copy/Paste/Duplicate
  'ctrl+c': 'copy',
  'meta+c': 'copy',
  'ctrl+v': 'paste',
  'meta+v': 'paste',
  'ctrl+d': 'duplicate',
  'meta+d': 'duplicate',

  // Delete
  'delete': 'delete',
  'backspace': 'delete',

  // Selection
  'ctrl+a': 'selectAll',
  'meta+a': 'selectAll',
  'escape': 'deselect',

  // Zoom
  'ctrl+0': 'zoomTo100',
  'meta+0': 'zoomTo100',
  'ctrl+=': 'zoomIn',
  'meta+=': 'zoomIn',
  'ctrl+-': 'zoomOut',
  'meta+-': 'zoomOut',

  // Save
  'ctrl+s': 'save',
  'meta+s': 'save',

  // Help
  'shift+/': 'help',
} as const;
