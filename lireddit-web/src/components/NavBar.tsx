import { Box, Button, Flex, Heading, Link } from '@chakra-ui/react'
import NextLink from 'next/link'
import { useRouter } from 'next/router'
import React from 'react'
import { useLogoutMutation, useMeQuery } from '../generated/graphql'

interface NavBarProps {

}

export const NavBar: React.FC<NavBarProps> = ({}) => {
    const router = useRouter()
    const [{fetching: logoutFetching}, logout] = useLogoutMutation()
    const [{data, fetching}] = useMeQuery()
    let body = null

    if(fetching){
        //loading
    }
    else if(!data?.me){
        body = (
            <>
                <NextLink href="/login">
                    <Link mr={2}> Login </Link>
                </NextLink>
                <NextLink href="/register">
                    <Link> Register </Link>
                </NextLink>
            </>
        )
    }
    else{
        body = (
            <Flex align="center">
                <NextLink href="/create-post">
                    <Button as={Link} mr={4}>
                    Create Post
                    </Button>
                </NextLink>
                <Box mr={3}>{data.me.username}</Box>
                <Button 
                    variant="link" 
                    onClick={async () => {
                        await logout({});
                        router.reload()
                    }}
                    isLoading={logoutFetching}
                >Logout</Button>
            </Flex>
        )
    }
    return (
        <Flex bg="tan" p={4} position="sticky" top="0" zIndex={1} align="center">
            <Flex flex={1} m="auto" align="center" maxW={800}>
            <NextLink href="/">
                <Link>
                    <Heading>LiReddit</Heading>
                </Link>
            </NextLink>
            <Box ml={'auto'}>
                {body}
            </Box>
            </Flex>
        </Flex>
    )
}