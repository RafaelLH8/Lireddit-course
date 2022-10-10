import { EditIcon, DeleteIcon } from "@chakra-ui/icons"
import { Flex, Box, Link } from "@chakra-ui/react"
import NextLink from 'next/link'
import { useDeletePostMutation, useMeQuery } from "../generated/graphql"

interface EditDeletePostButtonsProps {
    id: number,
    creatorId: number
}

const EditDeletePostButtons: React.FC<EditDeletePostButtonsProps> = ({
    id,
    creatorId
}) => {
    const [{data: meData}] = useMeQuery()
    const [, deletePost] = useDeletePostMutation()

    if(meData?.me?.id !== creatorId) {
        return null
    }
    return(
        <Flex ml='auto'>
            <NextLink href='/post/edit/[id]' as={`/post/edit/${id}`}>
                <Box as={Link} background={"lightgray"} borderRadius={5}>
                    <EditIcon aria-label="edit post" m={3} />
                </Box>
            </NextLink>
            <Box background={"lightgray"} borderRadius={5} ml={3}>
            <DeleteIcon aria-label='delete post' onClick={() => {
                deletePost({ id })
            }} m={3} />
            </Box>
        </Flex>
    )
}

export default EditDeletePostButtons