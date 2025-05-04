import { useMutation } from '@tanstack/react-query'
import * as ideaService from '../api/ideaService'

/**
 * Now expects { id, message } where `id` is the MongoDB `_id` string.
 */
export function useChatWithIdea() {
  return useMutation(({ id, message }) =>
    ideaService.chatWithIdea({ id, message })
  )
}
