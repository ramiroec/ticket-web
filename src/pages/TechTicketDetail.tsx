import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { api } from '../api';
import { useAuth } from '../context/AuthContext';

interface Comment {
  id: number;
  autor_id: number;
  tipo: string;
  mensaje: string;
  fecha: string;
}

interface Attachment {
  id: number;
  archivo_url: string;
  tipo?: string;
}

interface Ticket {
  id: number;
  resumen: string;
  descripcion: string;
  estado: string;
  urgencia: string;
  comentarios: Comment[];
  adjuntos: Attachment[];
}

const TechTicketDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [newComment, setNewComment] = useState('');
  const [estado, setEstado] = useState('');

  useEffect(() => {
    if (id) {
      api.get(`/tickets/${id}`)
        .then(t => {
          setTicket(t);
          setEstado(t.estado);
        })
        .catch(console.error);
    }
  }, [id]);

  const saveEstado = async () => {
    if (!ticket) return;
    try {
      const upd = await api.put(`/tickets/${ticket.id}`, { estado });
      setTicket(upd);
    } catch (e) {
      console.error(e);
    }
  };

  const { user } = useAuth();

  const addComment = async () => {
    if (!ticket || !newComment || !user) return;
    try {
      await api.post('/comentarios', { ticket_id: ticket.id, autor_id: user.id, tipo: 'interno', mensaje: newComment });
      const t = await api.get(`/tickets/${ticket.id}`);
      setTicket(t);
      setNewComment('');
    } catch (e) {
      console.error(e);
    }
  };

  if (!ticket) return <p>Cargando ticket...</p>;

  return (
    <div>
      <h2>Ticket #{ticket.id}</h2>
      <p><strong>Resumen:</strong> {ticket.resumen}</p>
      <p><strong>Descripción:</strong> {ticket.descripcion}</p>
      <p><strong>Urgencia:</strong> {ticket.urgencia}</p>

      <div>
        <label>Estado:</label>
        <select value={estado} onChange={e => setEstado(e.target.value)}>
          <option value="Abierto">Abierto</option>
          <option value="En análisis">En análisis</option>
          <option value="En curso">En curso</option>
          <option value="En espera">En espera</option>
          <option value="Resuelto">Resuelto</option>
          <option value="Cerrado">Cerrado</option>
          <option value="Reabierto">Reabierto</option>
        </select>
        <button onClick={saveEstado}>Guardar</button>
      </div>

      <h3>Comentarios</h3>
      <ul>
        {ticket.comentarios.map(c => (
          <li key={c.id}>{c.mensaje} <em>({c.tipo})</em></li>
        ))}
      </ul>
      <textarea
        value={newComment}
        onChange={e => setNewComment(e.target.value)}
      />
      <button onClick={addComment}>Agregar comentario interno</button>

      <h3>Adjuntos</h3>
      <ul>
        {ticket.adjuntos.map(a => (
          <li key={a.id}><a href={a.archivo_url} target="_blank" rel="noopener noreferrer">{a.archivo_url}</a></li>
        ))}
      </ul>
    </div>
  );
};

export default TechTicketDetail;
