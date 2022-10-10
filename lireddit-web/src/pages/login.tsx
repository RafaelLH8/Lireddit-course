import { Box, Button, Flex, Link } from "@chakra-ui/react";
import NextLink from 'next/link'
import { Formik, Form } from "formik";
import { withUrqlClient } from "next-urql";
import { useRouter } from "next/router";
import InputField from "../components/InputField";
import { Wrapper } from "../components/Wrapper";
import { useLoginMutation } from "../generated/graphql";
import { CreateUrqlClient } from "../utils/createUrqlClient";
import { toErrorMap } from "../utils/toErrorMap";

const Login: React.FC<{}> = ({}) => {
    const router = useRouter()
    const [, login] = useLoginMutation();
    return (
        <Wrapper variant='small'>
            <Formik 
                initialValues={{usernameOrEmail: "", password: ""}} 
                onSubmit={async (values, { setErrors }) => {
                    const response = await login(values)
                    if(response.data?.login.errors){
                        setErrors(toErrorMap(response.data.login.errors))
                    }
                    else if(response.data?.login.user){
                        if(typeof router.query.next === 'string')
                            router.push(router.query.next);
                        else
                            router.push('/')
                    }
                }}
            >
                {({ isSubmitting }) => (
                    <Form>
                        <InputField name='usernameOrEmail' placeholder='username or email' label='Username or email'/>
                        <Box mt={4}>
                            <InputField name='password' placeholder='password' label='Password' type='password'/>
                        </Box>
                        <Flex>
                            <NextLink href="/forgot-password">
                                <Link ml="auto">
                                    forgot password?
                                </Link>
                            </NextLink>
                        </Flex>
                        <Button type="submit" colorScheme="teal" mt={4} isLoading={isSubmitting} mx="auto">Login</Button>
                    </Form>
                )}
            </Formik>
        </Wrapper>
    )
}

export default withUrqlClient(CreateUrqlClient)(Login)