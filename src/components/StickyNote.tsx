import React, { useState, useEffect, useRef } from 'react';
import { saveToCache, loadFromCache } from '../utils/cacheUtils';

const STICKY_NOTE_KEY = 'sticky_note_content';

const StickyNote: React.FC = () => {
  const [note, setNote] = useState('');
  const [position, setPosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const dragOffset = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const noteRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const cachedNote = loadFromCache<string>(STICKY_NOTE_KEY, '');
    setNote(cachedNote);
    const cachedPos = loadFromCache<{ x: number; y: number }>('sticky_note_position', { x: 0, y: 0 });
    setPosition(cachedPos);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setNote(value);
    saveToCache(STICKY_NOTE_KEY, value);
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    setDragging(true);
    const rect = noteRef.current?.getBoundingClientRect();
    dragOffset.current = {
      x: e.clientX - (rect?.left || 0),
      y: e.clientY - (rect?.top || 0),
    };
    document.body.style.userSelect = 'none';
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!dragging) return;
      const x = e.clientX - dragOffset.current.x;
      const y = e.clientY - dragOffset.current.y;
      setPosition({ x, y });
    };
    const handleMouseUp = () => {
      if (dragging) {
        setDragging(false);
        saveToCache('sticky_note_position', position);
        document.body.style.userSelect = '';
      }
    };
    if (dragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [dragging, position]);

  return (
    <div
      ref={noteRef}
      style={{
        position: 'fixed',
        top: position.y || 24,
        right: undefined,
        left: position.x || undefined,
        background: '#fffbe7',
        border: '1px solid #e2c275',
        borderRadius: 8,
        padding: 16,
        boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
        maxWidth: 300,
        zIndex: 100,
        cursor: dragging ? 'grabbing' : 'grab',
        userSelect: 'none',
      }}
    >
      <div
        style={{ cursor: 'grab', marginBottom: 8, color: '#b59b3a', fontWeight: 'bold' }}
        onMouseDown={handleMouseDown}
      >
        Sticky Note
      </div>
      <textarea
        value={note}
        onChange={handleChange}
        placeholder="Write your note here..."
        style={{ width: '100%', minHeight: 80, border: 'none', background: 'transparent', resize: 'vertical', outline: 'none', fontSize: 16, color: '#111' }}
      />
    </div>
  );
};

export default StickyNote;
