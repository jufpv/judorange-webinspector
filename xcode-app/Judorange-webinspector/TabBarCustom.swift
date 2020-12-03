//
//  ViewController.swift
//  web_dev_browser-v0
//
//  Created by Julien Cuénot on 07/05/2019.
//  Copyright © 2019 Julien Cuénot. All rights reserved.
//

import UIKit
//import PlaygroundSupport



// MY CLASS
class TabBarCustom: UIViewController { // UIView
    
    // DEAL WITH PARENT VIEW CONTROLLER'ViewController' =========================
    var tabBarCustomDelegate: TabBarCustomDelegate?
    // ==========================================================================
    
    // VARS
    var scView:UIScrollView!
    var allButtons:Array<UIButton> = Array()
    var closeTabButton = UIButton()
    var currentButton = 0
    var xOffset:CGFloat = 1
    
    
    
    override func viewDidLoad() {
        // SUPER
        super.viewDidLoad()
        // CONFIGURE VIEW
        view.backgroundColor = colorGrey190
        view.border(position: .LINE_POSITION_BOTTOM, color: colorGrey190, width: 1.0)
        //view.borderRadius(corners: [.topRight], radius: 20)
        // CREATE HORIZONTAL SCROLL BAR
        createScrollBar()
        // ADD BUTTONS
        addButton( btn_title:"New tab" )
        // SELECT BUTTON
        selectButton(index:0)
        // ADD MORE BUTTON
        addButtonMore()
    } //viewDidLoad
    
    
    
    // ================= SROLL BAR =================
    func createScrollBar(){
        // SETTINGS
        let scViewWidth:CGFloat = view.frame.width - 50
        let scViewHeight:CGFloat = 40
        // SETUP SCROLL VIEW
        scView = UIScrollView(frame: CGRect(x:0, y:0, width:scViewWidth , height:scViewHeight))
        scView.backgroundColor = colorGrey190
        scView.autoresizingMask = [.flexibleWidth]
        scView.translatesAutoresizingMaskIntoConstraints = true
        scView.showsHorizontalScrollIndicator = false
        scView.showsVerticalScrollIndicator = false
        // ADD SCROLLBAR
        view.addSubview(scView)
    }
    
    func updateScrollBar(){
        // RESET START POS
        xOffset = 1 // Reset start pos
        // UPDATE BUTTONS POSITION
        for button in allButtons{
            let buttonPadding:CGFloat = 1
            let buttonWidth:CGFloat = 200
            let buttonHeight:CGFloat = scView.frame.size.height - (2*buttonPadding)
            // - - -
            let duration: TimeInterval = 0.3
            UIView.animate(withDuration: duration, animations: { () -> Void in
                button.frame = CGRect(
                    x: self.xOffset, y: CGFloat(buttonPadding), width: buttonWidth, height: buttonHeight
                )
            })
            // - - -
            xOffset = xOffset + CGFloat(buttonPadding) + button.frame.size.width
        }
        selectButton(index: currentButton) // For the style
        // SET SCROLLBAR WIDTH
        scView.contentSize = CGSize(width: xOffset, height: scView.frame.height)
        // Close tab btn
        updateCloseTabButton()
    }
    // ================= /scroll bar =================
    
    
    
    // ================= TABS =================
    func addButton(/*btn_id:Int,*/ btn_title:String){
        // SETTINGS
        let buttonPadding:CGFloat = 0
        let buttonWidth:CGFloat = 200
        let buttonHeight:CGFloat = scView.frame.size.height - (2*buttonPadding)
        // DECLARE BUTTON
        let button = UIButton()
        // CONFIGURE BUTTON
        //button.tag = btn_id
        button.backgroundColor = colorGrey210
        //button.setTitle("\(btn_id)", for: .normal)
        button.setTitle(btn_title, for: .normal)
        button.setTitleColor(colorGrey110, for: .normal)
        //button.layer.borderWidth = 1
        //button.layer.borderColor = colorBtnSelected.cgColor
        button.addTarget(self, action: #selector(handleSelect), for: UIControl.Event.touchUpInside)
        button.frame = CGRect(x: xOffset, y: CGFloat(buttonPadding), width: buttonWidth, height: buttonHeight)
        button.layer.cornerRadius = 0 //button.frame.size.height / 2
        //button.borderRadiusTop(corners: [.topRight], radius: 0)
        button.layer.masksToBounds = true
        button.titleLabel?.font = UIFont(name: "HelveticaNeue-Bold", size: 12)
        // Vertical
        //_ = NSLayoutConstraint(item: button, attribute: NSLayoutConstraint.Attribute.centerY, relatedBy: NSLayoutConstraint.Relation.equal, toItem: scView, attribute: NSLayoutConstraint.Attribute.centerY, multiplier: 1, constant: 0)

        xOffset = xOffset + CGFloat(buttonPadding) + button.frame.size.width
        // ADD BUTTON TO THE CLASS ARRAY
        allButtons.append( button ) // Add to array
        // ADD BUTTON TO THE VIEW
        scView.addSubview( button )
        
        // AUTO SCROLL
        if self.scView.contentSize.width > self.scView.bounds.size.width{
            let rightOffset = self.scView.contentSize.width - self.scView.bounds.size.width + self.scView.contentInset.right + 200
            let rightOffsetCG: CGPoint = CGPoint(x:rightOffset , y: 0)
            self.scView.setContentOffset(rightOffsetCG, animated: true)
        }
        
        // RE-DRAW SCROLLBAR
        updateScrollBar()
    }
    
    func removeButton(index:Int){
        
        // REMOVE ALL BUTTONS FROM THE SCROLLBAR
        let subViews = self.scView.subviews
        for subview in subViews{
            if subview == allButtons[index]{
                subview.removeFromSuperview()
            }
        }
        // REMOVE THE BUTTON FROM THE ARRAY
        allButtons.remove(at: index)
        // SELECT NEXT TAB OR LAST TAB
        let max_index = allButtons.count-1
        if index <= max_index{
            selectButton(index:index)
        }
        else {
            selectButton(index:max_index)
        }
        // RE-DRAW SCROLLBAR
        updateScrollBar()
    }
    
    func selectButton(index:Int){
        // SET CURRENT
        currentButton = index
        // SET STYLES
        let  allbuttons_count = allButtons.count // Get current number of buttons
        for i in 0 ... allbuttons_count-1 { // RESET STYLES
            allButtons[i].backgroundColor = colorGrey210
            allButtons[i].setTitleColor(colorGrey110, for: .normal)
        }
        allButtons[index].backgroundColor = colorTabNotSelected
        allButtons[index].setTitleColor(UIColor.orange, for: .normal)
        // Add close button
        updateCloseTabButton()
        // UPDATE URL FIELD
        tabBarCustomDelegate?.tabUpdateUrlField(index: index)
    }
    
    @objc func handleSelect(sender: UIButton){
        let  allbuttons_count = allButtons.count // Get current number of buttons
        for i in 0 ... allbuttons_count-1 { // RESET STYLES
            if sender == allButtons[i] {
                print("Onglet selectionné -> index "+String(i) )
                selectButton(index: i)
                // DISPLAY WEBVIEW
                tabBarCustomDelegate?.selectTab(index:i)
                break
            }
        }
    }
    // ================= /tabs =================
    
    
    
    // ================= CLOSE BUTTON =================
    func updateCloseTabButton(){
        removeCloseTabButton()
        if allButtons.count > 1 { // At least 1 tab
            // SETTINGS
            let buttonWidth:CGFloat = 200
            let buttonPadding:CGFloat = 1
            let closeButtonPadding:CGFloat = 8
            let closeButtonWidth:CGFloat = scView.frame.size.height //- (2*closeButtonPadding)
            let closeButtonHeight:CGFloat = scView.frame.size.height - (2*closeButtonPadding)
            let closeBtnXoffset:CGFloat =
                buttonWidth * CGFloat(currentButton+1) // Tab width
                    + buttonPadding * CGFloat(currentButton+1) * 1 // Add margins
                    - closeButtonWidth - closeButtonPadding
            // DECLARE BUTTON
            let closeButton = UIButton()
            // CONFIGURE BUTTON
            closeButton.backgroundColor = colorBtnClose
            closeButton.setTitle("✗", for: .normal)
            closeButton.setTitleColor(UIColor.white, for: .normal)
            closeButton.addTarget(self, action: #selector(handleCloseTab), for: UIControl.Event.touchUpInside)
            closeButton.frame = CGRect(x:closeBtnXoffset, y:closeButtonPadding, width: closeButtonWidth, height: closeButtonHeight)
            closeButton.layer.cornerRadius = 5 //closeButton.frame.size.height / 2
            closeButton.layer.masksToBounds = true
            // ADD BUTTON TO THE CLASS
            closeTabButton = closeButton
            // ADD BUTTON TO THE VIEW
            scView.addSubview(closeButton)
        }
    }
    
    func removeCloseTabButton(){
        let subViews = self.scView.subviews
        for subview in subViews{
            if subview == closeTabButton{
                subview.removeFromSuperview()
                closeTabButton = UIButton()
                break
            }
        }
    }
    
    @objc func handleCloseTab(sender: UIButton){
        let index = currentButton // Because remove button update the value of currentButton...
        // REMOVE BUTTON
        removeButton(index:index)
        // REMOVE WEBVIEW
        tabBarCustomDelegate?.removeTab(index:index)
    }
    // ================= /close button =================
    
    
    
    // ================= BUTTON MORE =================
    func addButtonMore(){
        // SETTINGS
        let buttonPadding:CGFloat = 1
        let buttonWidth:CGFloat = 50
        let buttonHeight:CGFloat = scView.frame.size.height - (2*buttonPadding)
        // DECLARE BUTTON
        let button = UIButton()
        // CONFIGURE BUTTON
        //button.tag = btn_id
        button.backgroundColor = colorBtnMore
        button.setTitle("+", for: .normal)
        //button.setTitle(btn_title, for: .normal)
        button.setTitleColor(UIColor.white, for: .normal)
        button.layer.cornerRadius = 0
        button.layer.masksToBounds = true
        button.addTarget(self, action: #selector(handleBtnMore), for: UIControl.Event.touchUpInside)
        // ADD BUTTON TO THE VIEW
        view.addSubview( button )
        // ANCHORS
        button.translatesAutoresizingMaskIntoConstraints = false
        NSLayoutConstraint.activate([
            button.trailingAnchor.constraint(equalTo: view.trailingAnchor, constant:0),
            button.topAnchor.constraint(equalTo: view.topAnchor, constant:0),
            button.bottomAnchor.constraint(equalTo: view.bottomAnchor, constant:0),
        ])
        // WIDTH
        let widthContraints =  NSLayoutConstraint(item: button, attribute: NSLayoutConstraint.Attribute.width, relatedBy: NSLayoutConstraint.Relation.equal, toItem: nil, attribute: NSLayoutConstraint.Attribute.notAnAttribute, multiplier: 1, constant: buttonWidth)
        NSLayoutConstraint.activate([widthContraints])
    }
    
    @objc func handleBtnMore(sender: UIButton){
        // CREATE AND SELECT BUTTON
        addButton(btn_title: "New tab")
        selectButton(index: allButtons.count-1)
        // CREATE AND SELECT WEBVIEW
        tabBarCustomDelegate?.newTab()
    }
    // ================= /button more =================
    
    
    
}



// SETUP CONTAINERVIEW
//let tabBarViewController = TabBarViewController()

// SETUP PREVIEW
//PlaygroundPage.current.liveView = tabBarViewController
