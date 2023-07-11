import React, { Dispatch, useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Search } from 'lucide-react'
import { ProfileButton } from './ProfileButton'
import { trpc } from '@renderer/trpcClient'

type NavBarPropType = {
  setQuery?: Dispatch<string>
  setPage?: Dispatch<number>
}
const Navbar = ({ setQuery, setPage }: NavBarPropType) => {
  const [showSearch, setShowSearch] = useState(false)
  const navigate = useNavigate()

  const { data: user, isLoading } = trpc.user.me.useQuery()

  const handleSearchSubmit = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key == 'Enter') {
      const query = e.currentTarget.value
      if (setQuery && setPage) {
        setQuery(query)
        setPage(1)
      }
      setShowSearch(false)
      navigate(`/?query=${query}&page=1`)
    }
  }
  return (
    <nav
      className={'flex items-center justify-between bg-accent p-4 text-white '}
    >
      <div className="flex items-center justify-between relative">
        <Link
          className="mr-4 text-foreground duration-150 hover:text-white"
          to="/?query=&page=1"
        >
          Home
        </Link>
        <Link
          className="mr-4 text-foreground duration-150 hover:text-white"
          to="/user/favorite-movies?page=1"
        >
          Favorite Movies
        </Link>

        <ProfileButton isLoading={isLoading} user={user} />
        <button
          className="ml-4 px-2 py-1 rounded-full text-white bg-gray-900 hover:bg-gray-800"
          onClick={() => setShowSearch(!showSearch)}
        >
          <Search />
        </button>
      </div>
      {showSearch && (
        <div className="z-10 bg-skin-secondary absolute top-36 w-4/5 left-1/2 -translate-x-1/2 rounded-lg p-6 mt-2">
          <input
            className="border-2 border-gray-600 rounded-lg p-1 w-full focus:outline-none 
            focus:border-skin-input-field duration-300 bg-gray-700 text-white"
            type="text"
            autoFocus
            placeholder="Search..."
            onKeyDown={handleSearchSubmit}
          />
        </div>
      )}
    </nav>
  )
}

export default Navbar
