import { useState, useEffect } from "react";
import { Select, Card, Layout, Typography, Space, Alert, Spin } from "antd";

const { Header, Content } = Layout;
const { Title } = Typography;

const countries = [
  { value: "Georgia", label: "საქართველო" },
  { value: "usa", label: "ამერიკა" },
  { value: "France", label: "საფრანგეთი" },
];

const Homepage = () => {
  const [universities, setUniversities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [temperature, setTemperature] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const response = await fetch(
          "https://api.open-meteo.com/v1/forecast?latitude=41.69&longitude=44.83&current=temperature_2m"
        );
        const data = await response.json();
        setTemperature(data.current.temperature_2m);
      } catch (err) {
        setError("ვერ მოხერხდა ამინდის მონაცემების მიღება");
      }
    };
    fetchWeather();
  }, []);

  const handleCountryChange = async (value) => {
    setLoading(true);
    try {
      const response = await fetch(
        `http://universities.hipolabs.com/search?country=${value}`
      );
      const data = await response.json();
      setUniversities(data);
      setError(null);
    } catch (err) {
      setError("ვერ მოხერხდა უნივერსიტეტების მონაცემების მიღება");
    }
    setLoading(false);
  };

  return (
    <div
      style={{
        padding: "20px",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "800px",
          marginTop: "-100px",
        }}
      >
        <Layout
          style={{
            background: "#fff",
            borderRadius: "8px",
            overflow: "hidden",
          }}
        >
          <Header
            style={{
              background: "#fff",
              borderBottom: "1px solid #f0f0f0",
              padding: "0 24px",
            }}
          >
            <div
              style={{
                height: "100%",
              }}
            >
              {" "}
              <Space>
                {temperature !== null ? (
                  <span
                    style={{
                      fontSize: "30px",
                      color: "blue",
                    }}
                  >
                    {temperature}°C new York
                  </span>
                ) : (
                  <Spin size="small" />
                )}
              </Space>
              <Title level={3} style={{ margin: 0 }}>
                მოძებნე აქ შენთვის სასურველი უნივერსიტეტი
              </Title>
            </div>
          </Header>

          <Content style={{ padding: "44px" }}>
            <Select
              style={{
                width: "100%",
                marginBottom: "24px",
              }}
              placeholder="აირჩიეთ ქვეყანა"
              onChange={handleCountryChange}
              options={countries}
            />

            {error && (
              <Alert
                type="error"
                message={error}
                style={{ marginBottom: "16px" }}
              />
            )}

            <Spin spinning={loading}>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
                  gap: "16px",
                }}
              >
                {universities.map((uni, index) => (
                  <Card key={index} title={uni.name} style={{ height: "100%" }}>
                    <p style={{ marginBottom: "16px" }}>{uni.country}</p>
                    {uni.web_pages?.map((page, i) => (
                      <a
                        key={i}
                        href={page}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ color: "red" }}
                      >
                        ვებ-გვერდის ნახვა
                      </a>
                    ))}
                  </Card>
                ))}
              </div>
            </Spin>
          </Content>
        </Layout>
      </div>
    </div>
  );
};

export default Homepage;
