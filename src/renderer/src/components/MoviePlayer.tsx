import React, { useEffect, useRef, useState } from 'react'
import type {
  Episode,
  LangType,
  LanguageEntity,
  Languages,
  SeasonType
} from '../lib/types/movieTypes'
import { Loader2, Menu } from 'lucide-react'
import { trpc } from '@renderer/trpcClient'
import { useParams, useSearchParams } from 'react-router-dom'
import { handleVideoKeyDown } from '@renderer/lib/utils'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue
} from './ui/select'

function MoviePlayer({
  dbEpisode,
  dbSeason,
  isFavorite,
  isTvShow,
  seasons,
  languages
}: {
  dbSeason?: string
  dbEpisode?: string
  isFavorite: boolean
  isTvShow: boolean
  seasons: SeasonType[]
  languages: LanguageEntity[]
}) {
  const [searchParams, setSearchParams] = useSearchParams()
  const [showEpisodes, setShowEpisodes] = useState(false)
  const [video, setVideo] = useState('')
  const videoRef = useRef<HTMLVideoElement>(null)
  const [season, setSeason] = useState('1')
  const [episode, setEpisode] = useState(isTvShow ? '1' : '0')
  const { movieId } = useParams()
  const utils = trpc.useContext()
  const { mutateAsync: updateRecord } =
    trpc.movies.updateFavoriteMovie.useMutation()

  const { data: settings, isLoading: settingsLoading } =
    trpc.settings.getUserSettings.useQuery()
  const { mutateAsync: updateSettings, isLoading: settingsUpdateLoading } =
    trpc.settings.updateUserSettings.useMutation({
      onSuccess: () => utils.settings.getUserSettings.invalidate()
    })
  const { data: episodes, isLoading: epsFetching } =
    trpc.movies.getEpisodes.useQuery({ movieId, season })

  const getVideoFromEpisode = (ep: number, episodes: Episode[]) => {
    const episode = episodes.find((item) => item.episode == ep)
    const engFile = episode?.files.find((file) => file.lang === settings.lang)
    const highRes = engFile?.files.find((file) => file.quality === 'HIGH')
    return highRes
  }
  const handleLanguageChange = async (value: string & LangType) => {
    await updateSettings({
      lang: value
    })
  }
  useEffect(() => {
    if (!epsFetching && episodes) {
      const highRes = getVideoFromEpisode(parseInt(episode), episodes)
      setVideo(highRes?.src)
    }
    if (!dbEpisode || !dbSeason) return
    if (dbEpisode !== episode && dbSeason !== season) {
      handleSetEpisode(dbEpisode)
      handleSetSeason(dbSeason, dbEpisode)
    } else if (dbEpisode !== episode) {
      handleSetEpisode(dbEpisode)
    } else if (dbSeason !== season) {
      handleSetSeason(dbSeason)
    }
  }, [epsFetching, settings?.lang])

  const handleSetSeason = (ses: string, ep?: string) => {
    setSeason(ses)
    setSearchParams(`season=${ses}&episode=${ep || episode}`)
  }

  const handleSetEpisode = (ep: string) => {
    if (!episodes) return
    const highRes = getVideoFromEpisode(parseInt(ep), episodes)
    setVideo(highRes?.src)
    setEpisode(ep)
    setSearchParams(`season=${season}&episode=${ep}`)
  }
  const handleSaveProgress = () => {
    const urlIsCorrect = window.location.hash.startsWith(
      '#/user/favorite-movies'
    )
    if (urlIsCorrect && isFavorite && season && episode) {
      const time = videoRef?.current?.currentTime
      const updateData = {
        movieId,
        season: parseInt(season),
        episode: parseInt(episode),
        time
      }

      updateRecord(updateData)
    }
  }
  useEffect(() => {
    return () => {
      handleSaveProgress()
    }
  }, [season, episode, videoRef?.current])

  return (
    <div className="relative w-4/5 min-h-[50vh]  flex justify-center bg-black">
      <video
        className="focus:outline-none"
        src={video}
        ref={videoRef}
        width={'100%'}
        controls
        contextMenu="hello"
        autoPlay
        onKeyDown={handleVideoKeyDown}
      />

      <button
        className="absolute top-0 right-0 p-5 z-10"
        onClick={() => setShowEpisodes(!showEpisodes)}
      >
        <Menu size={40} />
      </button>
      {showEpisodes && (
        <div className="absolute top-0 right-0 w-1/3 max-h-full overflow-y-scroll bg-gray-800/50 backdrop-blur-sm text-white p-4">
          <h2 className="text-2xl font-medium">Seasons</h2>
          <ul className="mt-8 flex">
            {epsFetching ? (
              <h2>Seasons Loading...</h2>
            ) : (
              seasons?.map((seasonItem, index) => (
                <li
                  key={index}
                  className={`text-xl py-2 cursor-pointer p-3 mx-1 
                          ${
                            season == seasonItem.number + ''
                              ? 'bg-accent'
                              : 'bg-muted'
                          }`}
                  onClick={() => handleSetSeason(seasonItem.number.toString())}
                >
                  <h3>{seasonItem.number}</h3>
                </li>
              ))
            )}
          </ul>
          <div className="p-5 pl-0">
            {settingsLoading || !settings ? null : (
              <Select
                onValueChange={handleLanguageChange}
                defaultValue={settings?.lang}
              >
                <SelectTrigger className="w-[180px]">
                  {settingsUpdateLoading ? (
                    <Loader2 />
                  ) : (
                    <SelectValue placeholder={'Select language'} />
                  )}
                </SelectTrigger>
                <SelectContent className="dark">
                  <SelectGroup>
                    {languages.map((lang) => (
                      <SelectItem
                        disabled={settingsUpdateLoading}
                        key={lang.code}
                        value={lang.code}
                      >
                        {lang.secondaryName}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            )}
          </div>
          <h2 className="text-2xl font-medium mt-5">Episodes</h2>
          <ul className="mt-8 ">
            {epsFetching ? (
              <h2>Episodes Loading...</h2>
            ) : (
              episodes &&
              episodes.map((episodeItem, index) => {
                return (
                  <li
                    key={index}
                    className={`text-xl py-4 cursor-pointer border-t-[1px]
                          ${
                            episode == episodeItem.episode + ''
                              ? 'bg-secondary'
                              : null
                          }`}
                    onClick={() => handleSetEpisode(episodeItem.episode)}
                  >
                    <h3 className="pl-5">
                      {episodeItem.episode}. {episodeItem.title}
                    </h3>
                  </li>
                )
              })
            )}
          </ul>
        </div>
      )}
    </div>
  )
}

export default MoviePlayer
