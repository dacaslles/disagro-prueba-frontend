import { Button, Card, Form, Input, message, Typography } from "antd";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import useApi from "../../hooks/useApi";
import { InboxOutlined, LockOutlined } from "@ant-design/icons";
import "../../styles/global.css";

const { Title } = Typography;

const Login = () => {
    const { login } = useAuth();
    const navigate = useNavigate();
    const { request, loading } = useApi();

    const handleLogin = async (values: { username: string, password: string }) => {
        try {
            const data = await request("POST", "/auth/login", {email: values.username, password: values.password});
            login(data.token);
            message.success(data.message);
            navigate("/events");
        } catch(error) {

        }
    };

    return (
        <div className="background-container">
            <Card style={{ width: 400, padding: 20 }}>
                <Title level={3} style={{ textAlign: "center" }}>Inicio de sesión</Title>
                <Form name="login-form" onFinish={handleLogin} layout="vertical">
                    <Form.Item name="username" rules={[{ required: true, message: "Por favor, ingresa tu usuario" }]}>
                        <Input prefix={<InboxOutlined />} placeholder="Correo" />
                    </Form.Item>
                    <Form.Item name="password" rules={[{ required: true, message: "Por favor, ingresa tu contraseña" }]}>
                        <Input.Password prefix={<LockOutlined />} placeholder="Contraseña" />
                    </Form.Item>
                    <Button type="primary" htmlType="submit" block loading={loading}>
                        {loading ? "Validando..." : "Ingresar"}
                    </Button>
                </Form>
            </Card>
      </div>
    );
}

export default Login;
