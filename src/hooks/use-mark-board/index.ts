import { useState } from 'react'
import { useParams } from 'react-router-dom'

import { db } from 'services'
import { Room } from 'typings'

import { getUpdatedGameState } from './helpers'

import { BoardSize } from 'typings'

interface Output {
  isMarking: boolean
  markBoard: (boardIndex: number, room: Room) => void
}

const useMarkBoard = (): Output => {
  const { roomId } = useParams()
  const [isMarking, setIsMarking] = useState<boolean>(false)

  async function markBoard(boardIndex: number, room: Room) {
    console.log("boardIndex:" + boardIndex + ", room: " + roomId)
    setIsMarking(true)
    try {
      const { board, playerTurn, turnNumber } = room
      console.log("board:" + board + ", playerTurn: " + playerTurn + ", turnNumber: " + turnNumber)

     const {
        newBoard,
        newIsGameDone,
        newMessage,
        newPlayerTurn,
        newTurnNumber,
      } = getUpdatedGameState({ board, boardIndex, playerTurn, turnNumber })
      console.log(
        "newBoard:" + newBoard + 
        ", newIsGameDone:" + newIsGameDone + 
        ", newMessage;" + newMessage + 
        ", newPlayerTurn:" + newPlayerTurn + 
        ", newTurnNumber:"+ newTurnNumber + 
        ", roomId:" + roomId
      )
      
      console.log("getUpdateGameState --> OK.")
      //console.log(newBoard)
      await db.collection('rooms').doc(roomId).update({
        board: newBoard,
        isGameDone: newIsGameDone,
        message: newMessage,
        playerTurn: newPlayerTurn,
        turnNumber: newTurnNumber,
      })
    } catch (err) {
      console.log("error in markboard : ")
      console.error(err)
    }
    setIsMarking(false)
  }

  return { isMarking, markBoard }
}

export default useMarkBoard
