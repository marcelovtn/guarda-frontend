import { useGetInstructorTrack } from '@/lib/track/track.slice'

interface TrackModule {
  id: string
  title: string
}

/**
 * Modules of the selected track, for the module dropdown.
 *
 * Reuses the track detail query the builder already loads, so picking a track
 * here usually resolves from cache.
 */
export function useTrackModules(trackId: string | null) {
  const { data, isLoading } = useGetInstructorTrack(trackId ?? '')

  const modules: TrackModule[] = trackId
    ? ((data as { modules?: TrackModule[] } | undefined)?.modules ?? [])
    : []

  return { modules, isLoading: Boolean(trackId) && isLoading }
}
