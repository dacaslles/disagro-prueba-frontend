import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Form, Input, DatePicker, Button, Table, Typography, Card, Spin, TableProps, message, Layout, Row, Col } from "antd";
import useApi from "../../hooks/useApi";
import { ItemComercial } from "../../types/ItemComercial";
import { PromocionEvento } from "../../types/PromocionEvento";
import { Evento } from "../../types/Evento";
import moment from "moment";
import "moment-timezone";
import { Content, Footer, Header } from "antd/es/layout/layout";

const { Title } = Typography;

const RegisterEvent = () => {
    const [searchParams] = useSearchParams();
    const eventId = searchParams.get("id");
    const [selectionType] = useState<'checkbox' | 'radio'>('checkbox');
  
    const { request, loading } = useApi();
    const [eventDetails, setEventDetails] = useState<Evento | null>(null);
    const [products, setProducts] = useState<ItemComercial[]>([]);
    const [promotions, setPromotions] = useState<PromocionEvento[]>([]);
    const [selectedProducts, setSelectedProducts] = useState<number[]>([]);
    const [search, setSearch] = useState("");
    const [discountProducts, setDiscountProducts] = useState<number>(0);
    const [discountServices, setDiscountServices] = useState<number>(0);
    const [promotionProducts, setPromotionProducts] = useState<number | undefined>(0);
    const [promotionServices, setPromotionServices] = useState<number | undefined>(0);

    const [form] = Form.useForm();
  
    useEffect(() => {
      const fetchProducts = async () => {
        try {
          const eventData = await request("GET", `/event/${eventId}`);
          const itemsdata = await request("GET", "/comercialItems");
          const promodata = await request("GET", "/events/promotions/"+eventId);

          eventData.fecha_inicio = eventData.fecha_inicio.replace("Z", "-06:00");
          eventData.fecha_fin = eventData.fecha_fin.replace("Z", "-06:00");

          setEventDetails(eventData);
          setProducts(itemsdata);
          setPromotions(promodata);
        } catch (error) {
          console.error("Error al obtener productos:", error);
        }
      };
      fetchProducts();
    }, [eventId, request]);
  
    const handleRegister = async (values: any) => {
      const { nombres, apellidos, email, fecha_registro } = values;
      
      if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]{1,100}$/.test(nombres) || !/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]{1,100}$/.test(apellidos)) {
        message.error("Los nombres y apellidos solo pueden contener letras y espacios, máximo 100 caracteres");
        return;
      }
      
      if (!selectedProducts.length) {
        message.error("Debe seleccionar al menos un producto o servicio");
        return;
      }
      
      const selectedDate = moment(fecha_registro.$d);

      if (eventDetails) {
        const eventStart = moment(eventDetails.fecha_inicio);
        const eventEnd = moment(eventDetails.fecha_fin);
        
        if (!selectedDate.isBetween(eventStart, eventEnd, undefined, "[]")) {
          message.error("La fecha y hora seleccionadas deben estar dentro del horario del evento");
          return;
        }
      }
      
      const formattedDate = selectedDate.format("YYYY-MM-DD HH:mm");
      
      const promotionsList = [promotionProducts, promotionServices].filter(id => id !== undefined) as number[];
      
      const payload = {
        eventId: Number(eventId),
        names: nombres,
        lastnames: apellidos,
        email: email,
        date: formattedDate,
        itemList: selectedProducts,
        promotionList: promotionsList,
      };
      
      try {
        await request("POST", "/events/register", payload);
        message.success("Registro exitoso");
      } catch (error) {
        message.error("Error en el registro, intente nuevamente");
      }
    };
  
    const filteredProducts = products.filter((product) =>
      product.nombre.toLowerCase().includes(search.toLowerCase())
    );

    const applyPromotions = (selectedItems: ItemComercial[]) => {
      let productDiscount = 0;
      let serviceDiscount = 0;
      let productPromoId = undefined;
      let servicePromoId = undefined;
      
      promotions.forEach(promo => {
        const applicableItems = selectedItems.filter(item => 
          (promo.mismo_tipo ? item.TipoItemComercial.id_tipo_item_comercial === promo.TipoItemComercial.id_tipo_item_comercial : true)
        );

        if (applicableItems.length >= promo.cantidad_requerida && applicableItems.reduce((acc,item) => acc + item.PrecioItemComercials[0].precio, 0) >= promo.monto_requerido) {
          if (promo.tipo_descuento === "porcentaje") {
            if (promo.TipoItemComercial.nombre === "producto") {
              productDiscount = Math.max(productDiscount, promo.valor_descuento);
              productPromoId = promo.id_promocion_evento;
            } else {
              serviceDiscount = Math.max(serviceDiscount, promo.valor_descuento);
              servicePromoId = promo.id_promocion_evento;
            }
          }
        }
      });

      setDiscountProducts(productDiscount);
      setDiscountServices(serviceDiscount);
      setPromotionProducts(productPromoId);
      setPromotionServices(servicePromoId);
    }
  
    const rowSelection: TableProps<ItemComercial> ['rowSelection'] = {
      onChange: (selectedRowKeys: React.Key[], selectedRows: ItemComercial[]) => {
        setSelectedProducts(selectedRows.map(m => m.id_item_comercial));
        applyPromotions(selectedRows);
      },
    };
  
    const columns = [
      {
        title: "Nombre",
        dataIndex: "nombre",
        key: "nombre",
      },
      {
        title: "Tipo",
        dataIndex: ["TipoItemComercial", "nombre"],
        key: "tipo",
      },
      {
        title: "Precio",
        dataIndex: "PrecioItemComercials",
        key: "precio",
        render: (precios: { precio: string }[]) => `Q${precios[0]?.precio || "0.00"}`,
      },
    ];
  
    return (
      <Layout style={{ minHeight: "100vh" }}>
        <Header style={{display: 'flex', justifyContent: 'space-between'}}>
            <div>
              {eventDetails && (
                <>
                  <Title level={2} style={{color:"white", margin: 0}}>Disagro</Title>
                  <Typography.Paragraph style={{color:"white", margin: 0}}>{eventDetails.nombre}</Typography.Paragraph>
                </>
              )}
            </div>
            <div style={{paddingTop: '0.7rem'}}>
              {eventDetails && (
                <>
                  <Typography.Paragraph style={{color:"white", margin: 0}}><strong>Fecha:</strong> {moment(eventDetails.fecha_inicio).format("DD/MM/YYYY HH:mm")} - {moment(eventDetails.fecha_fin).format("DD/MM/YYYY HH:mm")}</Typography.Paragraph>
                  <Typography.Paragraph style={{color:"white", margin: 0}}><strong>Ubicación:</strong> {eventDetails.ubicacion}</Typography.Paragraph>
                </>
              )}
            </div>
        </Header>
        <Content style={{ flex: 1 }}>
          <Card style={{ margin: "1rem" }}>
            {loading ? (
              <Spin size="large" />
            ) : (
              <div style={{ display: "flex", gap: "20px" }}>
                {/* Formulario de Registro */}
                <Form form={form} layout="vertical" onFinish={handleRegister} style={{ flex: 1 }}>
                  <Title level={4}>Información Personal</Title>
                  <Form.Item name="nombres" label="Nombres" rules={[{ required: true, message: "Campo obligatorio" }]}>
                    <Input placeholder="Ingrese su nombre" />
                  </Form.Item>
                  <Form.Item name="apellidos" label="Apellidos" rules={[{ required: true, message: "Campo obligatorio" }]}>
                    <Input placeholder="Ingrese sus apellidos" />
                  </Form.Item>
                  <Form.Item name="email" label="Correo Electrónico" rules={[{ required: true, message: "Campo obligatorio" }]}> 
                    <Input type="email" placeholder="Ingrese su correo" />
                  </Form.Item>
                  <Form.Item name="fecha_registro" label="Fecha y Hora de Asistencia" rules={[{ required: true, message: "Campo obligatorio" }]}>
                    <DatePicker showTime format="YYYY-MM-DD HH:mm" style={{ width: "100%" }} />
                  </Form.Item>
                </Form>
      
                {/* Tabla de Productos */}
                <div style={{ flex: 1 }}>
                  <Title level={4}>Seleccione Servicios y Productos de Interés</Title>
                  <Input.Search placeholder="Buscar..." onChange={(e) => setSearch(e.target.value)} style={{ marginBottom: 10 }} />
                  <Table 
                    rowSelection={{type: selectionType, ...rowSelection}} 
                    columns={columns} 
                    dataSource={filteredProducts} 
                    rowKey="id_item_comercial" 
                    pagination={{ pageSize: 5 }} 
                    size="small"
                  />
                  <Row style={{paddingBottom: "1rem"}}>
                    <Col style={{padding: "0 0.75rem 0 0.75rem"}} span={12}>
                      <Typography.Title level={5} style={{margin: 0, textAlign: "center"}}>Descuento obtenido en servicios</Typography.Title>
                      <Typography.Title level={5} style={{margin: 0, textAlign: "center"}}>{discountServices}%</Typography.Title>
                    </Col>
                    <Col style={{padding: "0 0.75rem 0 0.75rem"}} span={12}>
                      <Typography.Title level={5} style={{margin: 0, textAlign: "center"}}>Descuento obtenido en productos</Typography.Title>
                      <Typography.Title level={5} style={{margin: 0, textAlign: "center"}}>{discountProducts}%</Typography.Title>
                    </Col>
                  </Row>
                  <Row>
                    <Col style={{display: "flex", justifyContent: "end"}} span={24}>
                      <Button type="primary" onClick={() => form.submit()}>Confirmar asistencia</Button>
                    </Col>
                  </Row>
                </div>
              </div>
            )}
          </Card>
        </Content>
        <Footer style={{display: 'flex', justifyContent: "end", backgroundColor: "#001529"}}>
            <div style={{color: "white"}}>Atención al cliente: 2223-2425</div>
        </Footer>
      </Layout>
    );
  };
  
  export default RegisterEvent;
  