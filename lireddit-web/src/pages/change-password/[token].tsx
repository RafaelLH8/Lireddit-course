import { Box, Button, Flex, Link } from '@chakra-ui/react';
import { Formik, Form } from 'formik';
import { NextPage } from 'next';
import { withUrqlClient } from 'next-urql';
import { useRouter } from 'next/router';
import { useState } from 'react';
import InputField from '../../components/InputField';
import { Wrapper } from '../../components/Wrapper';
import { useChangePasswordMutation } from '../../generated/graphql';
import { CreateUrqlClient } from '../../utils/createUrqlClient';
import { toErrorMap } from '../../utils/toErrorMap';
import NextLink from 'next/link'

const ChangePassword: NextPage<{token: string}> = ({token}) => {
    const router = useRouter()
    const [, changePassword] = useChangePasswordMutation()
    const [tokenError, setTokenError] = useState("")
    return (
        <Wrapper variant='small'>
            <Formik 
                initialValues={{newPassword : ''}} 
                onSubmit={async (values, { setErrors }) => {
                    const response = await changePassword(
                        {
                            newPassword: values.newPassword,
                            token,
                        }
                    )
                    if(response.data?.changePassword.errors){
                        const errorMap = toErrorMap(response.data.changePassword.errors)
                        if('token' in errorMap){
                            setTokenError(errorMap.token)
                        }
                        setErrors(errorMap)
                    }
                    else if(response.data?.changePassword.user){
                        router.push('/')
                    }
                }}
            >
                {({ isSubmitting }) => (
                    <Form>
                        <InputField name='newPassword' placeholder='new password' label='New Password' type='password'/>
                        {tokenError && 
                            <Flex>
                                <Box mr={2} color='red'>{tokenError}</Box>
                                <NextLink href="/forgot-password">
                                    <Link>click here to get a new one</Link>
                                </NextLink>
                            </Flex>
                        }
                        <Button type="submit" colorScheme="teal" mt={4} isLoading={isSubmitting} mx="auto">Change Password</Button>
                    </Form>
                )}
            </Formik>
        </Wrapper>
    );
}

ChangePassword.getInitialProps = ({query}) => {
    return{
        token: query.token as string
    }
}

export default withUrqlClient(CreateUrqlClient, {ssr: false})(ChangePassword);