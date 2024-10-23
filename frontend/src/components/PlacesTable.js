// src/components/PlacesTable.js
import React from 'react';

const PlacesTable = ({ places, onDelete }) => {
  return (
    <table>
      <thead>
        <tr>
          <th>الاسم</th>
          <th>الوصف</th>
          <th>إحداثيات</th>
          <th>حذف</th>
        </tr>
      </thead>
      <tbody>
        {places.map((place) => (
          <tr key={place._id}>
            <td>{place.name}</td>
            <td>{place.description}</td>
            <td>{place.coordinates.coordinates.join(', ')}</td>
            <td>
              <button onClick={() => onDelete(place._id)}>حذف</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default PlacesTable;
