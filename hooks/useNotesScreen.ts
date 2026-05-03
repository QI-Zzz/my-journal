import { useEffect, useState } from 'react'
import { loadNotes, saveNotes } from '../storage/storage'
import { Note } from '../types'

export const useNotesScreen = () => {
    const [notes, setNotes] = useState<Note[]>([])
    const [selectedNote, setSelectedNote] = useState<Note | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        loadNotes().then(loaded => {
            setNotes(loaded ? sortNotes(loaded) : [])
            setLoading(false)
        })
    }, [])

    const sortNotes = (list: Note[]) =>
        [...list].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))

    const persist = (list: Note[]) => {
        const sorted = sortNotes(list)
        setNotes(sorted)
        saveNotes(sorted)
    }

    // ─── CRUD ──────────────────────────────────────────
    const createNote = () => {
        const note: Note = {
            id: Date.now().toString(),
            title: '',
            body: '',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        }
        persist([note, ...notes])
        setSelectedNote(note)
    }

    const updateNote = (id: string, changes: Partial<Pick<Note, 'title' | 'body'>>) => {
        const now = new Date().toISOString()
        const updated = notes.map(n =>
            n.id === id ? { ...n, ...changes, updatedAt: now } : n
        )
        persist(updated)
        setSelectedNote(prev => prev?.id === id ? { ...prev, ...changes, updatedAt: now } : prev)
    }

    const deleteNote = (id: string) => {
        persist(notes.filter(n => n.id !== id))
        setSelectedNote(null)
    }

    const openNote = (note: Note) => setSelectedNote(note)

    const closeNote = () => {
        // Remove if still empty
        if (selectedNote && !selectedNote.title.trim() && !selectedNote.body.trim()) {
            persist(notes.filter(n => n.id !== selectedNote.id))
        }
        setSelectedNote(null)
    }

    return {
        loading,
        notes,
        selectedNote,
        createNote,
        updateNote,
        deleteNote,
        openNote,
        closeNote,
    }
}
