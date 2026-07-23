// Sadece veritabanına gider
package com.berberapp.dashboard.repository;

import com.berberapp.dashboard.model.AppointmentModel;
import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface appointmentRepository extends MongoRepository<AppointmentModel, String> { // burda interface tanımladık çünkü db işlemleri hep aynı amelelik dolayısıyla class yerine interface tanımlayıp bırakıyoruz spring boot arkaplanda işlemleri hallediyor.

    List<AppointmentModel> findByBarberId(ObjectId barberId);
    List<AppointmentModel> findByBarberIdAndStatus(ObjectId barberId, String status);
    List<AppointmentModel> findByBarberIdAndStatusAndFullDate(ObjectId barberId, String status, String fullDate);
    List<AppointmentModel> findByBarberIdAndFullDate(ObjectId barberId, String fullDate);
}