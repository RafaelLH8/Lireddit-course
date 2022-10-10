import { Box, Button, Flex, Heading, Link, Stack, Text } from "@chakra-ui/react"
import NextLink from 'next/link'
import { withUrqlClient } from "next-urql"
import Layout from "../components/Layout"
import { useMeQuery, usePostsQuery } from "../generated/graphql"
import { CreateUrqlClient } from "../utils/createUrqlClient"
import { useState } from "react"
import { UpdootSection } from "../components/UpdootSection"
import EditDeletePostButtons from "../components/EditDeletePostButtons"

const Index = () => {
  const [variables, setVariables] = useState({limit: 15, cursor: null})
  const [{ data: meData }] = useMeQuery();
  const [{data, error, fetching}] = usePostsQuery({
    variables,
  })

  if(!fetching && !data){
    return <div>{error?.message}</div>
  }
  return(
    <Layout>
      <br />
      {fetching && !data ? <div>Loading...</div> : 
      <Stack spacing={8}>
        {data!.posts.posts.map((p) => 
        !p ? null : ( 
        <Flex p={5} shadow="md" borderWidth="1px" key={p.id}>
          <UpdootSection post={p}/>
          <Box flex={1}>
            <NextLink href="/post/[id]" as={`/post/${p.id}`}>
              <Link>
                <Heading fontSize="xl">{p.title}</Heading>
              </Link>
            </NextLink>
            <Text>posted by {p.creator.username}</Text>
            <Text flex={1} mt={4}>{p.textSnippet}</Text>
            {meData?.me?.id !== p.creator.id ? null : 
            <Flex ml="auto">
              <EditDeletePostButtons id={p.id} creatorId={p.creator.id}/>
            </Flex>}
          </Box>
        </Flex>
        ))}  
      </Stack>
      }
      {data && data.posts.hasMore ? <Flex>
        <Button isLoading={fetching} m="auto" my={8} onClick={() => {setVariables({limit: variables.limit, cursor: data.posts.posts[data.posts.posts.length -1].createdAt})}}>
          load more
        </Button>
      </Flex> : null }
    </Layout> 
  )
}

export default withUrqlClient(CreateUrqlClient, { ssr: true })(Index)
