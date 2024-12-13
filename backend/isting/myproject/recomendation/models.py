from django.db import models


# recomend_text/models.py
class ListingProduct(models.Model):
    name = models.CharField(max_length=255)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    stars = models.DecimalField(max_digits=3, decimal_places=2)
    link = models.URLField()
    image = models.ImageField(upload_to='product_images/', null=True, blank=True)
    category_name = models.CharField(max_length=255)

    class Meta:
        db_table = 'listing_product'

    def __str__(self):
        return self.name


