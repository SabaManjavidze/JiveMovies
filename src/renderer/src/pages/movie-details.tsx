import { KeyboardEvent, useEffect, useRef, useState } from 'react'
import NavBar from '../components/NavBar'
import type { Episode } from '../lib/types/movieTypes'
import { Loader2, Menu } from 'lucide-react'
import { useParams, useSearchParams } from 'react-router-dom'
import { trpc } from '@renderer/trpcClient'

const MovieDetails = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const [showEpisodes, setShowEpisodes] = useState(false)
  const [video, setVideo] = useState('')
  const videoRef = useRef<HTMLVideoElement>(null)
  const { movieId } = useParams()
  const [season, setSeason] = useState('1')
  const [episode, setEpisode] = useState('1')

  const { data: movieDetails, isLoading } = trpc.movies.getMovieById.useQuery({
    movieId
  })
  const { mutateAsync: updateRecord } =
    trpc.movies.updateFavoriteMovie.useMutation()

  const { data: episodes, isLoading: epsFetching } =
    trpc.movies.getEpisodes.useQuery({ movieId, season })

  const getVideoFromEpisode = (ep: number | string, episodes: Episode[]) => {
    const episode = episodes.find((item) => item.episode == ep)
    const engFile = episode?.files.find((file) => file.lang === 'ENG')
    const highRes = engFile?.files.find((file) => file.quality === 'HIGH')
    return highRes
  }
  useEffect(() => {
    if (!epsFetching && episodes) {
      const highRes = getVideoFromEpisode(parseInt(episode || '1'), episodes)
      setVideo(highRes?.src)
    }
    if (!isLoading && movieDetails) {
      const dbEpisode = movieDetails?.userProgress?.episode.toString()
      const dbSeason = movieDetails?.userProgress?.season.toString()
      if (dbEpisode !== episode && dbSeason !== season) {
        console.log(movieDetails.userProgress, episode, season)
        handleSetEpisode(dbEpisode)
        handleSetSeason(dbSeason, dbEpisode)
      } else if (dbEpisode !== episode) {
        handleSetEpisode(dbEpisode)
      } else if (dbSeason !== season) {
        handleSetSeason(dbSeason)
      }
    }
  }, [epsFetching, isLoading])

  const handleSetSeason = (ses: string, ep?: string) => {
    setSeason(ses)
    setSearchParams(`season=${ses}&episode=${ep || episode}`)
  }

  const handleSetEpisode = (ep: string) => {
    if (!episodes) return
    const highRes = getVideoFromEpisode(ep, episodes)
    setVideo(highRes?.src)
    setEpisode(ep)
    setSearchParams(`season=${season}&episode=${ep}`)
  }
  const handleSaveProgress = () => {
    const urlIsCorrect = window.location.hash.startsWith(
      '#/user/favorite-movies'
    )
    if (urlIsCorrect && movieDetails?.isFavorite && season && episode) {
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
  }, [season, episode])

  const handleVideoKeyDown = (e: KeyboardEvent<HTMLVideoElement>) => {
    switch (e.code) {
      case 'KeyF':
        e.currentTarget.requestFullscreen({
          navigationUI: 'hide'
        })
        break
      case 'KeyH':
        e.currentTarget.playbackRate = 2
        break
      case 'KeyG':
        e.currentTarget.playbackRate = 1.5
        break
      case 'KeyA':
        e.currentTarget.playbackRate -= 0.1
        break
      case 'KeyD':
        e.currentTarget.playbackRate += 0.1
        break
      case 'KeyR':
        e.currentTarget.playbackRate = 1
        break

      default:
        break
    }
  }

  return (
    <div className="w-full min-h-screen bg-background text-white pb-48">
      <NavBar />
      <div className="flex flex-col items-center bg-background mt-16">
        {isLoading ? (
          <div className="flex w-full justify-center items-center">
            <Loader2 color="pink" size={30} />
          </div>
        ) : (
          <div className="bg-background flex flex-col items-center w-full">
            <div className="relative w-4/5 min-h-[50vh]  flex justify-center bg-black">
              <video
                className="focus:outline-none"
                src={video}
                ref={videoRef}
                width={'100%'}
                controls
                autoPlay
                onKeyDown={handleVideoKeyDown}
              />
              {movieDetails?.isTvShow ? (
                <button
                  className="absolute top-0 right-0 p-5 z-10"
                  onClick={() => setShowEpisodes(!showEpisodes)}
                >
                  <Menu size={40} />
                </button>
              ) : null}
              {movieDetails?.isTvShow && showEpisodes && (
                <div className="absolute top-0 right-0 w-1/3 max-h-full overflow-y-scroll bg-gray-800/50 backdrop-blur-sm text-white p-4">
                  <h2 className="text-2xl font-medium">Seasons</h2>
                  <ul className="mt-8 flex">
                    {epsFetching ? (
                      <h2>Seasons Loading...</h2>
                    ) : (
                      movieDetails.seasons.data?.map((seasonItem, index) => (
                        <li
                          key={index}
                          className={`text-xl py-2 cursor-pointer p-3 mx-1 
                          ${
                            season == seasonItem.number + ''
                              ? 'bg-accent'
                              : 'bg-muted'
                          }`}
                          onClick={() =>
                            handleSetSeason(seasonItem.number.toString())
                          }
                        >
                          <h3>{seasonItem.number}</h3>
                        </li>
                      ))
                    )}
                  </ul>
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
                            onClick={() =>
                              handleSetEpisode(episodeItem.episode)
                            }
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
            <div className="flex justify-between w-4/5 min-h-[250px] pl-5 pt-5 ">
              <div className="w-64 relative">
                <img
                  className="object-contain"
                  src={
                    movieDetails?.posters?.data[400] ||
                    movieDetails?.posters?.data[200] ||
                    movieDetails?.poster
                  }
                />
              </div>
              <div className="flex flex-col w-3/5 mt-5">
                <h1 className="text-2xl font-medium">
                  {movieDetails?.secondaryName}
                </h1>
                <p className="text-base mt-5 w-4/5">
                  {
                    movieDetails?.plots?.data.find(
                      (item) => item.language === 'ENG'
                    )?.description
                  }
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default MovieDetails
