function(doc) {
  if (doc.date) {
    emit(doc.date, {title: doc.title, date: doc.date});
  }
};