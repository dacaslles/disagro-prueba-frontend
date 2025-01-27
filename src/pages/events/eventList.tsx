import { useEffect, useState } from "react";
import { Table, Typography, Spin, Card, Button, Layout } from "antd";
import useApi from "../../hooks/useApi";
import { Evento } from "../../types/Evento";
import { useNavigate } from "react-router-dom";
import { Content, Footer, Header } from "antd/es/layout/layout";

const { Title } = Typography;

const EventList = () => {
  const { request, loading } = useApi();
  const [events, setEvents] = useState<Evento[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const data = await request("GET", "/events");
        setEvents(data);
      } catch (error) {
        console.error("Error al obtener eventos:", error);
      }
    };

    fetchEvents();
  }, [request]);

  const handleRegister = (id: number) => {
    navigate(`/events/register?id=${id}`);
  };

  const columns = [
    {
      title: "Nombre",
      dataIndex: "nombre",
      key: "nombre",
    },
    {
      title: "Descripción",
      dataIndex: "descripcion",
      key: "descripcion",
      ellipsis: true,
    },
    {
      title: "Fecha Inicio",
      dataIndex: "fecha_inicio",
      key: "fecha_inicio",
      render: (text: string) => new Date(text).toLocaleDateString(),
    },
    {
      title: "Fecha Fin",
      dataIndex: "fecha_fin",
      key: "fecha_fin",
      render: (text: string) => new Date(text).toLocaleDateString(),
    },
    {
      title: "Ubicación",
      dataIndex: "ubicacion",
      key: "ubicacion",
    },
    {
        title: "Acciones",
        key: "acciones",
        render: (_: any, record: Evento) => (
            <Button type="primary" onClick={() => handleRegister(record.id_evento)}>
            Inscribirse
            </Button>
        ),
    },
  ];

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Header style={{display: 'flex', flexDirection: "column"}}>
          <Title level={2} style={{color:"white", margin: 0}}>Disagro</Title>
          <Typography.Paragraph style={{color:"white", margin: 0}}>Lista de eventos</Typography.Paragraph>
      </Header>
      <Content style={{ flex: 1, padding: "20px" }}>
        <Card style={{ margin: "20px" }}>
          <Title level={2}>Lista de Eventos</Title>
          {loading ? (
            <Spin size="large" />
          ) : (
            <Table 
              columns={columns} 
              dataSource={events} 
              rowKey="id_evento" 
              pagination={{ pageSize: 5 }} 
            />
          )}
        </Card>
      </Content>
      <Footer style={{display: 'flex', justifyContent: "end", backgroundColor: "#001529"}}>
          <div style={{color: "white"}}>Atención al cliente: 2223-2425</div>
      </Footer>
    </Layout>
  );
};

export default EventList;