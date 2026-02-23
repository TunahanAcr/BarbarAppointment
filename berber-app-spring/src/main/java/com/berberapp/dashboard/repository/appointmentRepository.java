// Sadece veritabanına gider
package com.berberapp.dashboard.repository;

import com.berberapp.dashboard.model.appointmentModel;
import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface appointmentRepository extends MongoRepository<appointmentModel, String> { // burda interface tanımladık çünkü db işlemleri hep aynı amelelik dolayısıyla class yerine interface tanımlayıp bırakıyoruz spring boot arkaplanda işlemleri hallediyor.
    List<appointmentModel> findByBarberId(ObjectId barberId);
}