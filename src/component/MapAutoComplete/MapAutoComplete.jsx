import React, { use, useEffect, useState } from "react";
import { GoogleMap, useJsApiLoader, MarkerF, Circle } from "@react-google-maps/api";
import { Autocomplete, Box, CircularProgress, TextField } from "@mui/material";
import usePlacesAutocomplete, { getGeocode, getLatLng } from "use-places-autocomplete";

function MapAutocomplete({ mapZoom = 16, coords, radius = 0, handleChange, height, label }) {
  const containerStyle = { width: "100%", height: height || "400px" };
  const defaultCenter = { lat: -3.745, lng: -38.523 };
  const { isLoaded } = useJsApiLoader({ 
    id: "google-map-script", 
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
    libraries: ["places"]
  });
  const [center, setCenter] = useState(coords || defaultCenter);
  const [place, setPlace] = useState(null)
  const [autocompleteValue, setAutocompleteValue] = useState("");

  useEffect(() => {
    setCenter(coords);
  }, [coords]);
  useEffect(() => {
    getPlaceFromLatLng(center?.lat, center?.lng)
  }, [center]);
  useEffect(() => {
    getCurrentLocation();
  }, [])

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      console.log('geo location not supported');
    } else {
      navigator.geolocation.getCurrentPosition((position) => {
        setCenter({ lat: position.coords.latitude, lng: position.coords.longitude })
      })
    }
  }

  const handleAutocompleteChange = (e, value) => {
    setAutocompleteValue(value);
    clearSuggestions();
    getGeocode({ address: value?.description }).then((results) => {
      const { lat, lng } = getLatLng(results[0]);
      handleChange({ latitude: lat, longitude: lng });
      setCenter({ lat, lng });
    });
  };

  const getPlaceFromLatLng = async (lat, lng) => {
    try {
      const results = await getGeocode({ location: { lat, lng } });
      if (results.length > 0) {
        const placeId = results[0].place_id;
        const address = results[0].formatted_address;
        setPlace({ placeId, description: address })
        return placeId;
      }
    } catch (error) {
      console.error("Error fetching Place ID:", error);
    }
  }
  const {
    ready,
    suggestions: { status, data, loading },
    setValue,
    clearSuggestions,
  } = usePlacesAutocomplete({ debounce: 300 });

  const handleInput = (e) => setValue(e.target.value);

  return isLoaded && ready ? (
    <Box sx={{ position: "relative" }}>
      <Autocomplete
        loading={loading}
        options={data}
        value={place}
        getOptionLabel={(option) => option.description}
        onChange={handleAutocompleteChange}
        fullWidth
        renderInput={(params) => (
          <TextField
            {...params}
            onChange={handleInput}
            value={autocompleteValue}
            label={label || "Search Location"}
            sx={{ mb: 2 }}
            InputProps={{
              ...params.InputProps,
              endAdornment: (
                <>
                  {loading ? (<CircularProgress color="inherit" size={20} />) : null}
                  {params.InputProps.endAdornment}
                </>
              ),
            }}
          />
        )}
      />
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={mapZoom}
        onClick={(e) => {
          handleChange({
            latitude: e.latLng.lat(),
            longitude: e.latLng.lng()
          })
        }
        }
      >
        <MarkerF position={center} />
        <Circle
          center={center}
          radius={+radius}
          options={{
            fillColor: "rgba(135, 206, 235, 0.3)",
            strokeColor: "#1E90FF",
            strokeOpacity: 0.8,
            strokeWeight: 2,
          }}
        />
      </GoogleMap>
    </Box>
  ) : null;
}

export default React.memo(MapAutocomplete);