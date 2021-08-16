import Head from 'next/head'
import { Typography, Form, Card, Input, Button, Space } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import styles from '../../styles/Auth.module.css'
import login from '../../logic/auth'

export default function Home() {
    const { Title, Text, Link } = Typography;

    const onFinish = async (user) => {
        let token = await login(user);

        console.log(token)
    };

    return (
        <>
            <Head>
                <title>Aurora</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <main className={styles.container}>
                <Title className={styles.title} level={4}>Aurora</Title>
                <Card>
                    <Form
                        name="normal_login"
                        initialValues={{ remember: true }}
                        onFinish={onFinish}
                    >
                        <Form.Item
                            name="username"
                            rules={[{ required: true, message: 'Please input your Username!' }]}
                        >
                            <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Username" />
                        </Form.Item>
                        <Form.Item
                            name="password"
                            rules={[{ required: true, message: 'Please input your Password!' }]}
                        >
                            <Input
                                prefix={<LockOutlined className="site-form-item-icon" />}
                                type="password"
                                placeholder="Password"
                            />
                        </Form.Item>
                        <Form.Item>
                            <Button block type="primary" htmlType="submit">
                                Log in
                            </Button>
                        </Form.Item>
                    </Form>
                </Card>
                <br />
                <Card>
                    <Space direction="vertical">
                        <Text>New to Aurora?</Text>
                        <Link href="#">Create an account.</Link>
                    </Space>
                </Card>
            </main>
        </>
    )
}
