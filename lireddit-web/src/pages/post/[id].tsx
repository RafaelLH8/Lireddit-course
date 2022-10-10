import { Box, Heading } from "@chakra-ui/react"
import { withUrqlClient } from "next-urql"
import EditDeletePostButtons from "../../components/EditDeletePostButtons"
import Layout from "../../components/Layout"
import { CreateUrqlClient } from "../../utils/createUrqlClient"
import useGetPostFromUrl from "../../utils/useGetPostFromUrl"

const Post = ({})=> {
    const [{data, error, fetching}] = useGetPostFromUrl()
    if(fetching){
        return(
            <Layout><div>Loading...</div></Layout>
        )
    }

    if(error){
        <div>{error.message}</div>
    }

    if(!data?.post){
        return <Layout>Post not found.</Layout>
    }

    return (
        <Layout>
            <Heading>
                {data.post.title}
            </Heading>
            <Box mb={4}>{data.post.text}</Box>
            <EditDeletePostButtons id={data.post.id} creatorId={data.post.creator.id}/>
        </Layout>
    )
}

export default withUrqlClient(CreateUrqlClient, {ssr: true})(Post)