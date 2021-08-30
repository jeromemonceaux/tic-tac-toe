import React, { FC } from 'react'

import { H1 } from 'components'

import { BoardSize } from 'typings'

import { useCurrentUser, useMarkBoard, useRoom } from 'hooks'

import { Block, Container, Row } from './styles'

const Board: FC = () => {
  const { isMarking, markBoard } = useMarkBoard()
  const { isFetching, room } = useRoom()
  const currentUser = useCurrentUser()

  if (isFetching) return <H1>Loading Room...</H1>
  if (!room) return <H1>Room Not Found</H1>

  const { board, isGameDone, playerOId, playerTurn, playerXId } = room

  async function handleClick(index: number) {
    console.log("handleClick index : " + index)
    console.log("----board Index : " + board[index])
    if (!isMarking && !board[index]) {
       await markBoard(index, room!)
    }
  }

 var cols = [];
  var ii = 0;
  for( var i = 0; i < BoardSize[1]; i++ ){
    var rows = [];
    for( var j = 0; j < BoardSize[0]; j++ ) {
      const jj = ii 
      rows.push(<Block onClick={() => handleClick(jj)}>{board[jj]}</Block>)
      ii = ii + 1
    }
    cols.push(<Row>{rows}</Row>)
  }

 return (
    <Container marking={isMarking}>{cols}</Container> 
  )

/*
  return (
    <Container marking={isMarking}>
      <Row>
        <Block onClick={() => handleClick(0)}>{board[0]}</Block>
        <Block onClick={() => handleClick(1)}>{board[1]}</Block>
        <Block onClick={() => handleClick(2)}>{board[2]}</Block>
        <Block onClick={() => handleClick(3)}>{board[2]}</Block>
      </Row>
      <Row>
        <Block onClick={() => handleClick(3)}>{board[3]}</Block>
        <Block onClick={() => handleClick(4)}>{board[4]}</Block>
        <Block onClick={() => handleClick(5)}>{board[5]}</Block>
        <Block onClick={() => handleClick(5)}>{board[5]}</Block>
      </Row>
      <Row>
        <Block onClick={() => handleClick(6)}>{board[6]}</Block>
        <Block onClick={() => handleClick(7)}>{board[7]}</Block>
        <Block onClick={() => handleClick(8)}>{board[8]}</Block>
        <Block onClick={() => handleClick(8)}>{board[8]}</Block>
      </Row>
      <Row>
        <Block onClick={() => handleClick(9)}>{board[9]}</Block>
        <Block onClick={() => handleClick(10)}>{board[10]}</Block>
        <Block onClick={() => handleClick(11)}>{board[11]}</Block>
        <Block onClick={() => handleClick(11)}>{board[11]}</Block>
      </Row>
    </Container>
  )
  */
}

export default Board
