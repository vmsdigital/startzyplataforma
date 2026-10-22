'use client';
import { useRef, useState, useEffect } from 'react';
import { Upload, X } from 'lucide-react';
import { parseBackup } from '@/lib/backup';

export default function MarketingImport({ onDone }: { onDone: (message: string) => void }) {
  const file = useRef<HTMLInputElement>(null), dialog = useRef<HTMLDialogElement>(null);
  const [data, setData] = useState<ReturnType<typeof parseBackup> | null>(null), [error, setError] = useState(''), [busy, setBusy] = useState(false);
  useEffect(() => { if (data || error) dialog.current?.showModal(); }, [data, error]);
  function close() { dialog.current?.close(); setData(null); setError(''); }
  async function read(value?: File) {
    if (!value) return;
    try { if (value.size > 1_000_000) throw new Error('Use um arquivo de até 1 MB.'); setData(parseBackup(JSON.parse(await value.text()))); setError(''); }
    catch (e) { setError((e as Error).message); }
    if (file.current) file.current.value = '';
  }
  async function restore() {
    setBusy(true); setError('');
    try {
      const r = await fetch('/api/marketing/import', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
      const result = await r.json(); if (!r.ok) throw new Error(result.error);
      onDone(`${result.created} registros importados. ${result.skipped} já existentes foram preservados.`); close();
    } catch (e) { setError((e as Error).message); } finally { setBusy(false); }
  }
  return <><input ref={file} hidden type="file" accept="application/json,.json" onChange={e => read(e.target.files?.[0])}/><button className="button secondary" onClick={() => file.current?.click()}><Upload size={16}/>Importar</button><dialog className="editor event-editor" ref={dialog} onCancel={close} aria-labelledby="marketing-import-title"><div className="editor-header"><div><p className="eyebrow">SEU PLANEJAMENTO</p><h2 id="marketing-import-title">Importar Marketing</h2></div><button className="icon-button" aria-label="Fechar importação" onClick={close}><X size={20}/></button></div><div className="editor-content">{error && <p className="form-error" role="alert">{error}</p>}{data && <><p>{data.items.length} pautas e {data.events.length} datas personalizadas encontradas.</p><p>Os registros que já existem são preservados. As imagens privadas precisam continuar na mesma conta ou ser enviadas novamente.</p><ul className="import-preview">{data.items.slice(0,8).map(item => <li key={item.id}>{item.title}</li>)}</ul></>}</div><div className="editor-footer"><button className="button secondary" onClick={close}>Cancelar</button><button className="button primary" disabled={!data || busy} onClick={restore}>{busy ? 'Importando…' : 'Adicionar ao planejamento'}</button></div></dialog></>;
}
