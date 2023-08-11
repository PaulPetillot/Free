import { parseEther } from 'ethers'
import React, { useState } from 'react'

import {
  Button,
  FormControl,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from '@chakra-ui/react'

interface IExtensionModalProps {
  isOpen: boolean
  onClose: () => void
  currentDeadline: number
}

function ExtensionModal({
  isOpen,
  onClose,
  currentDeadline,
}: IExtensionModalProps) {
  const initialRef = React.useRef(null)
  const finalRef = React.useRef(null)
  const deadlineDatePlusOneDay = new Date(
    Number(currentDeadline) * 1000 + 86400000
  )

  const [newDeadline, setNewDeadline] = useState('')
  const [amountToAdd, setAmountToAdd] = useState('')

  const handleExtension = () => {
    const newDeadlineUnix = new Date(newDeadline).getTime() / 1000
    const amountToAddInWei = parseEther(amountToAdd)

    console.log('newDeadlineUnix', newDeadlineUnix)
    console.log('amountToAddInWei', amountToAddInWei)
  }

  return (
    <Modal
      initialFocusRef={initialRef}
      finalFocusRef={finalRef}
      isOpen={isOpen}
      onClose={onClose}
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Extend the project</ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>
          <FormControl>
            <FormLabel>New Deadline</FormLabel>
            <Input
              onChange={(e) => setNewDeadline(e.target.value)}
              value={newDeadline}
              type="date"
              ref={initialRef}
              placeholder="Insert a new date"
              min={deadlineDatePlusOneDay.toISOString().split('T')[0]}
            />
          </FormControl>

          <FormControl mt={4}>
            <FormLabel>Amount To Add (in Eth)</FormLabel>
            <Input
              onChange={(e) => setAmountToAdd(e.target.value)}
              value={amountToAdd}
              type="number"
              placeholder="Add the amount to add"
            />
          </FormControl>
        </ModalBody>

        <ModalFooter>
          <Button onClick={handleExtension} colorScheme="green" mr={3}>
            Extend
          </Button>
          <Button onClick={onClose}>Cancel</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}

export default ExtensionModal
