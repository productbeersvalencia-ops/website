# Feature: Events

## Descripción

Sistema de gestión de eventos para Product Beers Valencia. Permite:
- Mostrar eventos públicamente (próximos y pasados)
- Gestionar eventos desde el panel de admin
- Sincronizar con Fourvenues API (futuro)
- Gestionar ponentes (speakers) y sponsors por evento

## Estado

- [x] Base de datos (migración creada)
- [x] Tipos y schemas Zod
- [x] Queries (lectura)
- [x] Commands (escritura)
- [x] Handlers (validación + lógica)
- [x] Server Actions
- [ ] Página pública `/eventos`
- [ ] Página pública `/eventos/[slug]`
- [ ] Panel admin `/admin/eventos`
- [ ] Panel admin `/admin/eventos/[id]`
- [ ] Cliente Fourvenues API
- [ ] Sincronización automática

## Arquitectura

```
src/features/events/
├── CLAUDE.md                 # Este archivo
├── index.ts                  # Exports públicos
├── types/index.ts            # Zod schemas + TS types
├── events.query.ts           # SELECT operations
├── events.command.ts         # INSERT/UPDATE/DELETE
├── events.handler.ts         # Validación + lógica de negocio
├── events.actions.ts         # Server Actions (entry points)
├── lib/                      # (futuro)
│   └── fourvenues.client.ts  # Cliente API Fourvenues
└── components/               # (futuro)
    ├── event-card.tsx
    ├── event-list.tsx
    └── ...
```

## Modelo de Datos

### events
| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | UUID | Primary key |
| title | TEXT | Título del evento |
| slug | TEXT | URL amigable (único) |
| description | TEXT | Descripción completa (markdown) |
| short_description | TEXT | Descripción corta para cards |
| date | TIMESTAMPTZ | Fecha/hora inicio |
| end_date | TIMESTAMPTZ | Fecha/hora fin (opcional) |
| location_name | TEXT | Nombre del lugar |
| location_address | TEXT | Dirección completa |
| location_city | TEXT | Ciudad (default: Valencia) |
| location_maps_url | TEXT | Link a Google Maps |
| image_url | TEXT | Imagen del evento |
| registration_url | TEXT | Link de registro externo |
| max_attendees | INT | Aforo máximo |
| fourvenues_id | TEXT | ID en Fourvenues (para sync) |
| fourvenues_slug | TEXT | Slug en Fourvenues |
| last_synced_at | TIMESTAMPTZ | Última sincronización |
| status | TEXT | draft/published/cancelled |
| source | TEXT | manual/fourvenues |
| featured | BOOLEAN | Evento destacado |
| created_at | TIMESTAMPTZ | Fecha creación |
| updated_at | TIMESTAMPTZ | Fecha actualización |
| created_by | UUID | Usuario que lo creó |

### speakers
| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | UUID | Primary key |
| name | TEXT | Nombre completo |
| role | TEXT | Cargo/rol |
| company | TEXT | Empresa |
| bio | TEXT | Biografía |
| photo_url | TEXT | Foto |
| linkedin_url | TEXT | LinkedIn |
| twitter_url | TEXT | Twitter/X |
| website_url | TEXT | Web personal |

### sponsors
| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | UUID | Primary key |
| name | TEXT | Nombre |
| logo_url | TEXT | Logo |
| website_url | TEXT | Web |
| description | TEXT | Descripción |
| tier | TEXT | platinum/gold/silver/standard |
| is_active | BOOLEAN | Activo |

### event_speakers (relación M:N)
| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | UUID | Primary key |
| event_id | UUID | FK a events |
| speaker_id | UUID | FK a speakers |
| role_in_event | TEXT | speaker/host/panelist |
| talk_title | TEXT | Título de la charla |
| talk_description | TEXT | Descripción |
| order_index | INT | Orden de aparición |

### event_sponsors (relación M:N)
| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | UUID | Primary key |
| event_id | UUID | FK a events |
| sponsor_id | UUID | FK a sponsors |
| tier_override | TEXT | Tier específico para este evento |

## Queries Disponibles

### Públicas
- `getPublishedEvents()` - Todos los eventos publicados
- `getUpcomingEvents(limit?)` - Próximos eventos
- `getPastEvents(limit?)` - Eventos pasados
- `getEventBySlug(slug)` - Evento por slug
- `getNextFeaturedEvent()` - Próximo evento destacado

### Admin
- `getAllEvents()` - Todos los eventos (cualquier status)
- `getEventById(id)` - Evento por ID con speakers/sponsors

### Speakers/Sponsors
- `getAllSpeakers()` - Todos los speakers
- `getSpeakerById(id)` - Speaker por ID
- `getAllSponsors()` - Todos los sponsors
- `getActiveSponsors()` - Sponsors activos

## Actions Disponibles

### Eventos
- `createEventAction` - Crear evento (FormData)
- `updateEventAction` - Actualizar evento
- `deleteEventAction` - Eliminar evento
- `publishEventAction` - Publicar evento
- `unpublishEventAction` - Despublicar (volver a draft)
- `cancelEventAction` - Cancelar evento

### Speakers
- `createSpeakerAction` - Crear speaker
- `updateSpeakerAction` - Actualizar speaker
- `deleteSpeakerAction` - Eliminar speaker

### Sponsors
- `createSponsorAction` - Crear sponsor
- `updateSponsorAction` - Actualizar sponsor
- `deleteSponsorAction` - Eliminar sponsor

### Relaciones
- `addSpeakerToEventAction` - Añadir speaker a evento
- `removeSpeakerFromEventAction` - Quitar speaker de evento
- `updateEventSpeakerAction` - Actualizar datos de speaker en evento
- `addSponsorToEventAction` - Añadir sponsor a evento
- `removeSponsorFromEventAction` - Quitar sponsor de evento

## RLS Policies

```sql
-- Lectura pública de eventos publicados
CREATE POLICY "Public can view published events"
  ON events FOR SELECT
  USING (status = 'published');

-- Admins pueden todo
CREATE POLICY "Admins can manage events"
  ON events FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND 'admin' = ANY(profiles.user_flags)
    )
  );
```

## Decisiones de Arquitectura

1. **Slug auto-generado**: Si no se proporciona, se genera desde el título
2. **Source tracking**: Cada evento indica si es `manual` o `fourvenues`
3. **Speakers/Sponsors globales**: Se gestionan por separado y se relacionan con eventos
4. **Tier override**: Los sponsors pueden tener tier diferente por evento

## Integración Fourvenues (Pendiente)

Requiere:
- [ ] `FOURVENUES_API_KEY` en `.env.local`
- [ ] `FOURVENUES_ORGANIZATION_ID` en `.env.local`

Cliente a implementar en `lib/fourvenues.client.ts`:
- `FourvenuesClient.getEvents()` - Obtener todos los eventos
- `FourvenuesClient.getEventById(id)` - Obtener evento específico
- `mapFourvenuesEvent(fvEvent)` - Mapear a nuestro formato

## Testing

- [ ] Solo E2E - CRUD básico, flujos de publicación
- [x] Unit tests no necesarios - Sin lógica compleja más allá de validación Zod

## Troubleshooting

### "Evento no encontrado"
- Verificar que el ID/slug es correcto
- Verificar permisos (público solo ve `published`)

### "Ya existe un evento con ese slug"
- Cambiar el slug manualmente
- El sistema añade timestamp automático si hay conflicto

### RLS bloquea operaciones
- Verificar que el usuario tiene `'admin'` en `profiles.user_flags`
- Verificar que está autenticado
