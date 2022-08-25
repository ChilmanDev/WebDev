var currentTab = 'tab1';

        
        
        function showTab(tabName) {
            var ctab = document.getElementById(currentTab);
            var ntab = document.getElementById(tabName);
            ctab.style.display = 'none';
            ntab.style.display = 'block';
            currentTab = tabName;
        }