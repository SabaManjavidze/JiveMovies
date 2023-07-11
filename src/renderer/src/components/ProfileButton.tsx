import React from 'react'
import { Button } from '../components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '../components/ui/dropdown-menu'
import { Link } from 'react-router-dom'
import { nanoid } from 'nanoid'
import { EMPTY_IMAGE } from '@renderer/lib/constants'

export function ProfileButton({
  isLoading,
  user
}: {
  isLoading: boolean
  // user?: UserType | null
  user?: any | null
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          className="flex items-center px-2 py-1 rounded-full text-foreground bg-background 
            duration-300 hover:bg-background/20"
          isLoading={isLoading}
        >
          <img
            src={EMPTY_IMAGE}
            width={40}
            height={40}
            className="rounded-full"
          />
          <span className="ml-2 text-xl">{user?.username}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 dark">
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          {[
            { title: 'My Movies', route: '/me/my-movies' },
            { title: 'Settings', route: '/settings' },
            { title: 'Log Out', route: '/user/logout' }
          ].map((item) => (
            <DropdownMenuItem key={nanoid()}>
              <Link to={item.route}>{item.title}</Link>
            </DropdownMenuItem>
          ))}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
