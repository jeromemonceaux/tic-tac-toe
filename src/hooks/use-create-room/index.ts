import { useState } from 'react'

import { useCurrentUser } from 'hooks'
import { db } from 'services'

import { BoardSize } from 'typings'

function genId(): string {
  let result = ''
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
  for (let i = 0; i < 4; i++)
    result += characters.charAt(Math.floor(Math.random() * characters.length))
  return result
}

interface Output {
  createRoom: () => void
  isCreatingRoom: boolean
}

const useCreateRoom = (): Output => {
  const user = useCurrentUser()
  const [isCreatingRoom, setIsCreatingRoom] = useState(false)

  async function createRoom(): Promise<string | undefined> {
    if (!user) return undefined

    setIsCreatingRoom(true)
    let roomId: string | undefined = user.roomId

    try {
      console.log("is rommid exist " + roomId)
      if (roomId) {
        console.log("found room " + roomId) 
        const foundUserRoom = await db.collection('rooms').doc(roomId).get()
        console.log("foundUserRoom.exists " + foundUserRoom.exists) 
        if (foundUserRoom.exists) return roomId
      } else {
        console.log("not found room " + roomId) 
        let newIdGenerated = false
        roomId = genId()

        console.log("new room id " + roomId) 

        while (!newIdGenerated) {
          console.log("create room id " + roomId) 
           const foundRoom = await db.collection('rooms').doc(roomId).get()
          if (foundRoom.exists) roomId = genId()
          else newIdGenerated = true
        }

          console.log("push room id to users " + roomId) 
        await db.collection('users').doc(user.id).update({ roomId })
      }

      const startingTurn = Math.round(Math.random()) ? 'X' : 'O'
      await db
        .collection('rooms')
        .doc(roomId)
        .set({
          board: new Array(BoardSize[1]*BoardSize[0]),
          isGameDone: false,
          message: `${startingTurn}'s Turn`,
          owner: user.id,
          playerTurn: startingTurn,
          startingTurn: startingTurn,
          turnNumber: 1,
        })
    } catch (err) {
      console.error(err)
    } finally {
      setIsCreatingRoom(false)
      return roomId
    }
  }

  return { createRoom, isCreatingRoom }
}

export default useCreateRoom
