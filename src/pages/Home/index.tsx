import React,{useState,useRef,useEffect ,useMemo,useCallback  } from 'react';
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Tooltip,
  useMapEvents,
  useMapEvent,
  Pane,
  Rectangle
} from 'react-leaflet';
import L from "leaflet";
import Guide from '@/components/Guide';
import { trim } from '@/utils/format';
import { PageContainer } from '@ant-design/pro-components';
import { useModel } from '@umijs/max';
import styles from './index.less';
import 'leaflet/dist/leaflet.css';

// 1.1自定义marker图标
const customMarker = new L.icon({
    iconUrl: "https://unpkg.com/leaflet@1.5.1/dist/images/marker-icon.png",
    iconSize: [25, 41],
    iconAnchor: [10, 41],
    popupAnchor: [2, -40]
});
// 1.2marker坐标
const myData = JSON.parse('[{"id":3,"stopId":"STOPID-TA21 9AD~1536","coordinates":[[50.98115822630729,-3.2093097241813626]]},{"id":4,"stopId":"STOPID-EX4 8HH~1537","coordinates":[[50.73658088928259,-3.481135132172668]]},{"id":5,"stopId":"STOPID-EX3 0QH~1538","coordinates":[[50.68477425437021,-3.448725268717586]]},{"id":6,"stopId":"STOPID-TQ6 9LA~1539","coordinates":[[50.3528669555381,-3.600095665457003]]},{"id":7,"stopId":"STOPID-DE65 6BG~1542","coordinates":[[52.87354650871699,-1.5581688412757033]]},{"id":8,"stopId":"STOPID-NG20 9QU~1545","coordinates":[[53.217696,-1.1362328]]},{"id":9,"stopId":"STOPID-NG20 9QU~1548","coordinates":[[53.217696,-1.1362328]]},{"id":10,"stopId":"STOPID-NG20 9QU~1546","coordinates":[[53.21800641457751,-1.1354169130791034]]},{"id":11,"stopId":"STOPID-NP11 4ER~1554","coordinates":[[51.666329754845755,-3.1443305326604944]]},{"id":12,"stopId":"STOPID-NP23 7WJ~1555","coordinates":[[51.734530948192244,-3.178078655551782]]},{"id":13,"stopId":"STOPID-GL18 2AN~1532","coordinates":[[51.98455968622588,-2.445541072124886]]},{"id":14,"stopId":"STOPID-GL18 1BY~1531","coordinates":[[51.93142465831891,-2.407781870252181]]},{"id":15,"stopId":"STOPID-HR2 9AS~1533","coordinates":[[52.000714453292005,-2.7953236019870005]]},{"id":16,"stopId":"STOPID-HR4 7NH~1534","coordinates":[[52.092459099571236,-2.9051723608040594]]},{"id":17,"stopId":"STOPID-LD3 8NA~1535","coordinates":[[51.93748683342681,-3.4157228488264124]]},{"id":18,"stopId":"STOPID-HR8 2DH~1525","coordinates":[[52.0346525,-2.4365534]]},{"id":19,"stopId":"STOPID-HR8 2DH~1528","coordinates":[[52.0346525,-2.4365534]]},{"id":20,"stopId":"STOPID-HR8 2DH~1524","coordinates":[[52.034652760327226,-2.4365536678734805]]},{"id":21,"stopId":"STOPID-HR8 2XW~1523","coordinates":[[52.02880753462352,-2.429552550694105]]},{"id":22,"stopId":"STOPID-CF39 9DU~1556","coordinates":[[51.5983434,-3.4249801]]},{"id":23,"stopId":"STOPID-CF39 9DU~1557","coordinates":[[51.59803073699841,-3.423115687588953]]},{"id":24,"stopId":"STOPID-BN17 5QZ~1551","coordinates":[[50.81120291892175,-0.5873687372834572]]},{"id":25,"stopId":"STOPID-BN2 6AF~1552","coordinates":[[50.84513347167287,-0.08241743108671877]]},{"id":26,"stopId":"STOPID-WV1 1PN~1540","coordinates":[[52.59340809839608,-2.1244413046916635]]},{"id":27,"stopId":"STOPID-HR8 2DH~1527","coordinates":[[52.0346525,-2.4365534]]},{"id":28,"stopId":"STOPID-HR8 2DH~1529","coordinates":[[52.0346525,-2.4365534]]},{"id":29,"stopId":"STOPID-HR8 2DH~1526","coordinates":[[52.034652760327226,-2.4365536678734805]]},{"id":30,"stopId":"STOPID-CV3 4LH~1541","coordinates":[[52.39288327159674,-1.477401293729262]]},{"id":31,"stopId":"STOPID-LE18 2FT~1543","coordinates":[[52.588473356251626,-1.1238469402885252]]},{"id":32,"stopId":"STOPID-NG2 5HE~1544","coordinates":[[52.932301974273514,-1.1127634222678116]]},{"id":33,"stopId":"STOPID-NG20 9QU~1549","coordinates":[[53.217696,-1.1362328]]},{"id":34,"stopId":"STOPID-NG20 9QU~1547","coordinates":[[53.21800641457751,-1.1354169130791034]]},{"id":35,"stopId":"STOPID-NP16 6PS~1553","coordinates":[[51.69368874342044,-2.7321130647982597]]},{"id":36,"stopId":"STOPID-CF3 1TH~1530","coordinates":[[51.504294235355275,-3.119426476644571]]}]')

const LocationMarker=()=> {
  const [position, setPosition] = useState(null)
  const map = useMapEvents({
    click() {
      map.locate()
    },
    locationfound(e) {
      setPosition(e.latlng)
      map.flyTo(e.latlng, map.getZoom())
    },
  })

  return position === null ? null : (
    <Marker position={position} icon={customMarker}>
      <Popup>You are here</Popup>
    </Marker>
  )
}

// pannel
const outer = [
  [50.505, -29.09],
  [52.505, 29.09],
]
const inner = [
  [49.505, -2.09],
  [53.505, 2.09],
]
function BlinkingPane() {
  const [render, setRender] = useState(true)
  const timerRef = useRef()
  useEffect(() => {
    timerRef.current = setInterval(() => {
      setRender((r) => !r)
    }, 5000)
    return () => {
      clearInterval(timerRef.current)
    }
  }, [])

  return render ? (
    <Pane name="cyan-rectangle" style={{ zIndex: 500 }}>
      <Rectangle bounds={outer} pathOptions={{ color: 'cyan' }} />
    </Pane>
  ) : null
}
const center = {
  lat: 51.505,
  lng: -0.09,
}
const DraggableMarker =()=> {
  const [draggable, setDraggable] = useState(true)
  const [position, setPosition] = useState(center)
  const markerRef = useRef(null)
  const map = useMapEvents({
    locationfound(e) {
      setPosition(e.latlng)
      map.flyTo(e.latlng, map.getZoom())
    },
  })
  const eventHandlers = useMemo(
    () => ({
      dragend() {
        const marker = markerRef.current
        if (marker != null) {
          setPosition(marker.getLatLng())
          // console.log(marker,'哪里啊')
          map.flyTo(marker.getLatLng(), map.getZoom())
        }
      },
    }),
    [],
  )
  const toggleDraggable = useCallback(() => {
    setDraggable((d) => !d)
  }, [])

  return (
    <Marker
      draggable={draggable}
      eventHandlers={eventHandlers}
      position={position}
      ref={markerRef}>
      <Popup minWidth={90}>
        <span onClick={toggleDraggable}>
          {draggable
            ? 'Marker is draggable'
            : 'Click here to make marker draggable'}
        </span>
      </Popup>
    </Marker>
  )
}

const HomePage: React.FC = () => {
  const { name } = useModel('global');
  const animateRef = useRef(false) // animate panning
   // 动态规划
   const SetViewOnClick =({ animateRef })=> {
    const map = useMapEvent('click', (e) => {
      map.setView(e.latlng, map.getZoom(), {
        animate: false,
      })
    })
    return null
  }

  return (
    <PageContainer ghost>
      <div className={styles.container}>
        <Guide name={trim(name)} />
        <MapContainer center={[52.6376, -1.135171]} zoom={7} style={{ height: '100vh' }}>
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          />
          {/* <LocationMarker /> */}
                {myData.map((stop) => (
                <Marker
                  key={stop.id}
                  position={stop.coordinates[0]}
                  icon={customMarker}
                >        
                <Tooltip direction="right" offset={[0, 0]}  permanent>{stop.id}</Tooltip>
                </Marker>
                ))}
              {/* <BlinkingPane />
              <Pane name="yellow-rectangle" style={{ zIndex: 499 }}>
                <Rectangle bounds={inner} pathOptions={{ color: 'yellow' }} />
                <Pane name="purple-rectangle">
                  <Rectangle bounds={outer} pathOptions={{ color: 'purple' }} />
                </Pane>
          </Pane> */}
          <DraggableMarker />
          <SetViewOnClick animateRef={animateRef} />
            </MapContainer>
      </div>
    </PageContainer>
  );
};

export default HomePage;
